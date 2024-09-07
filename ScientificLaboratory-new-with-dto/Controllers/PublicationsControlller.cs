using Microsoft.AspNetCore.Mvc;
using ScientificLaboratory_new_with_dto.Models;
using ScientificLaboratory_new_with_dto.DTOs;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScientificLaboratory_new_with_dto.Data;
using Microsoft.AspNetCore.Authorization;

namespace ScientificLaboratory_new_with_dto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PublicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePublication([FromForm] PublicationCreateUpdateDTO publicationDto, [FromForm] IFormFile pdfFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (pdfFile == null || pdfFile.Length == 0)
            {
                return BadRequest("PDF file is required.");
            }

            // Convert the uploaded PDF file to byte array
            byte[] pdfContent;
            using (var memoryStream = new MemoryStream())
            {
                await pdfFile.CopyToAsync(memoryStream);
                pdfContent = memoryStream.ToArray();
            }

            // Create the Pdf entity
            var pdf = new Pdf
            {
                FileName = pdfFile.FileName,
                Content = pdfContent
            };

            // Create the Publication entity
            var publication = new Publication
            {
                Title = publicationDto.Title,
                Abstract = publicationDto.Abstract,
                Year = publicationDto.Year,
                Pages = publicationDto.Pages,
                ISSN = publicationDto.ISSN,
                DOI = publicationDto.DOI,
                Type = publicationDto.Type,  // Add Type field here
                Pdf = pdf,  // Associate the Pdf with the Publication
                Keywords = publicationDto.Keywords
            };

            // Handle authors
            foreach (var authorDto in publicationDto.Authors)
            {
                var author = await _context.Authors.FirstOrDefaultAsync(a => a.Name == authorDto.Name);
                if (author == null)
                {
                    author = new Author
                    {
                        Name = authorDto.Name,
                        Institution = authorDto.Institution
                    };
                    _context.Authors.Add(author);
                }

                var publicationAuthor = new PublicationAuthor
                {
                    Publication = publication,
                    Author = author
                };

                publication.PublicationAuthors.Add(publicationAuthor);
            }

            _context.Publications.Add(publication);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPublicationById), new { id = publication.Id }, publication);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetPublicationById(int id)
        {
            var publication = await _context.Publications
                .Include(p => p.Pdf)  // Include Pdf entity to access file name
                .Include(p => p.PublicationAuthors)
                .ThenInclude(pa => pa.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (publication == null)
            {
                return NotFound();
            }

            var publicationDto = new PublicationDetailDTO
            {
                Title = publication.Title,
                Abstract = publication.Abstract,
                Year = publication.Year,
                Pages = publication.Pages,
                ISSN = publication.ISSN,
                DOI = publication.DOI,
                Type = publication.Type,  // Add Type field here
                PdfBase64 = publication.Pdf != null ? Convert.ToBase64String(publication.Pdf.Content) : null,
                Authors = publication.PublicationAuthors.Select(pa => new AuthorDetailDTO
                {
                    Name = pa.Author.Name,
                    Institution = pa.Author.Institution
                }).ToList(),
                Keywords = publication.Keywords
            };

            return Ok(publicationDto);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllPublications()
        {
            var publications = await _context.Publications
                .Include(p => p.Pdf)
                .Include(p => p.PublicationAuthors)
                    .ThenInclude(pa => pa.Author)
                .ToListAsync();

            var publicationDtos = publications.Select(publication => new
            {
                Id = publication.Id, // Make sure the ID is included
                Title = publication.Title,
                Abstract = publication.Abstract,
                Year = publication.Year,
                Pages = publication.Pages,
                ISSN = publication.ISSN,
                DOI = publication.DOI,
                Type = publication.Type,  // Add Type field here
                Keywords = publication.Keywords,
                Authors = publication.PublicationAuthors.Select(pa => new
                {
                    Name = pa.Author.Name,
                    Institution = pa.Author.Institution
                }).ToList(),
                PdfFileName = publication.Pdf?.FileName
            }).ToList();

            return Ok(publicationDtos);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePublication(int id, [FromBody] PublicationCreateUpdateDTO publicationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var publication = await _context.Publications
                .Include(p => p.Pdf)
                .Include(p => p.PublicationAuthors)
                .ThenInclude(pa => pa.Author)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (publication == null)
            {
                return NotFound();
            }

            // Update publication properties
            publication.Title = publicationDto.Title;
            publication.Abstract = publicationDto.Abstract;
            publication.Year = publicationDto.Year;
            publication.Pages = publicationDto.Pages;
            publication.ISSN = publicationDto.ISSN;
            publication.DOI = publicationDto.DOI;
            publication.Type = publicationDto.Type;
            publication.Keywords = publicationDto.Keywords;

            // Update authors
            // Get existing authors
            var existingAuthors = publication.PublicationAuthors.ToList();

            // Remove authors not in the updated list
            foreach (var existingAuthor in existingAuthors)
            {
                if (!publicationDto.Authors.Any(a => a.Name == existingAuthor.Author.Name))
                {
                    _context.PublicationAuthors.Remove(existingAuthor);
                }
            }

            // Add new authors
            foreach (var authorDto in publicationDto.Authors)
            {
                if (!existingAuthors.Any(ea => ea.Author.Name == authorDto.Name))
                {
                    var author = await _context.Authors.FirstOrDefaultAsync(a => a.Name == authorDto.Name);
                    if (author == null)
                    {
                        author = new Author
                        {
                            Name = authorDto.Name,
                            Institution = authorDto.Institution
                        };
                        _context.Authors.Add(author);
                    }

                    publication.PublicationAuthors.Add(new PublicationAuthor
                    {
                        Author = author,
                        Publication = publication
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PublicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool PublicationExists(int id)
        {
            return _context.Publications.Any(e => e.Id == id);
        }


        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublication(int id)
        {
            var publication = await _context.Publications
                .Include(p => p.Pdf)
                .Include(p => p.PublicationAuthors)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (publication == null)
            {
                return NotFound();
            }

            _context.Publications.Remove(publication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/upload-pdf")]
        public async Task<IActionResult> UploadPdf(int id, IFormFile pdfFile)
        {
            if (pdfFile == null || pdfFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var publication = await _context.Publications
                .Include(p => p.Pdf) // Ensure Pdf is included in the query
                .FirstOrDefaultAsync(p => p.Id == id);

            if (publication == null)
            {
                return NotFound();
            }

            // If the Pdf object is null, create a new Pdf object
            if (publication.Pdf == null)
            {
                publication.Pdf = new Pdf();
            }

            // Save the PDF file to the Pdf object
            using (var memoryStream = new MemoryStream())
            {
                await pdfFile.CopyToAsync(memoryStream);
                publication.Pdf.Content = memoryStream.ToArray();
                publication.Pdf.FileName = pdfFile.FileName;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("view-pdf/{id}")]
        public async Task<IActionResult> ViewPdf(int id)
        {
            var publication = await _context.Publications
                                            .Include(p => p.Pdf)
                                            .FirstOrDefaultAsync(p => p.Id == id);

            if (publication == null || publication.Pdf == null)
            {
                return NotFound("PDF not found");
            }

            return File(publication.Pdf.Content, "application/pdf", publication.Pdf.FileName);
        }
    }
}

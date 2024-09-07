using Microsoft.AspNetCore.Mvc;
using ScientificLaboratory_new_with_dto.Data;
using ScientificLaboratory_new_with_dto.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ScientificLaboratory_new_with_dto.Dto;

namespace ScientificLaboratory_new_with_dto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FundingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FundingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        // [Authorize(Roles = "Admin")]
        public IActionResult CreateFunding(FundingDTO fundingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var funding = new Funding
            {
                Source = fundingDTO.Source,
                SponsorName = fundingDTO.SponsorName,
                FundingbyYears = fundingDTO.FundingbyYears?.Select(f => new FundingByYear
                {
                    Year = f.Year,
                    Amount = f.Amount
                }).ToList()
            };

            _context.Fundings.Add(funding);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetFunding), new { id = funding.FundingId }, funding);
        }

        [HttpGet("{id}")]
        public IActionResult GetFunding(int id)
        {
            var funding = _context.Fundings
                .Include(f => f.FundingbyYears)
                .FirstOrDefault(f => f.FundingId == id);

            if (funding == null)
            {
                return NotFound();
            }

            return Ok(funding);
        }

        [HttpGet]
        public IActionResult GetAllFundings()
        {
            var fundings = _context.Fundings
                .Include(f => f.FundingbyYears)
                .ToList();

            return Ok(fundings);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFunding(int id, FundingDTO fundingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingFunding = _context.Fundings
                .Include(f => f.FundingbyYears)
                .FirstOrDefault(f => f.FundingId == id);

            if (existingFunding == null)
            {
                return NotFound();
            }

            existingFunding.Source = fundingDTO.Source;
            existingFunding.SponsorName = fundingDTO.SponsorName;
            existingFunding.FundingbyYears = fundingDTO.FundingbyYears?.Select(f => new FundingByYear
            {
                Year = f.Year,
                Amount = f.Amount
            }).ToList();

            _context.SaveChanges();

            return NoContent();
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult PartialUpdateFunding(int id, FundingDTO fundingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingFunding = _context.Fundings
                .Include(f => f.FundingbyYears)
                .FirstOrDefault(f => f.FundingId == id);

            if (existingFunding == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(fundingDTO.Source))
            {
                existingFunding.Source = fundingDTO.Source;
            }

            if (!string.IsNullOrEmpty(fundingDTO.SponsorName))
            {
                existingFunding.SponsorName = fundingDTO.SponsorName;
            }

            if (fundingDTO.FundingbyYears != null)
            {
                existingFunding.FundingbyYears = fundingDTO.FundingbyYears.Select(f => new FundingByYear
                {
                    Year = f.Year,
                    Amount = f.Amount
                }).ToList();
            }

            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFunding(int id)
        {
            var funding = _context.Fundings
                .Include(f => f.FundingbyYears)
                .FirstOrDefault(f => f.FundingId == id);

            if (funding == null)
            {
                return NotFound();
            }

            _context.Fundings.Remove(funding);
            _context.SaveChanges();

            return NoContent();
        }
    }
}

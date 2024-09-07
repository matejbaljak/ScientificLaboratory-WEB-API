using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLaboratory_new_with_dto.Dto;
using ScientificLaboratory_new_with_dto.Mappers;
using ScientificLaboratory_new_with_dto.Models;
using ScientificLaboratory_new_with_dto.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using static ScientificLaboratory_new_with_dto.Dto.NewsDto;

[Route("api/[controller]")]
[ApiController]
public class NewsController : ControllerBase
{
    private readonly INewsRepository _newsRepository;

    public NewsController(INewsRepository newsRepository)
    {
        _newsRepository = newsRepository;
    }

    // GET: api/News
    [HttpGet]
    public async Task<ActionResult<IEnumerable<News>>> GetNews()
    {
        var news = await _newsRepository.GetAllAsync();
        return Ok(news);
    }

    // GET: api/News/5
    [HttpGet("{id}")]
    public async Task<ActionResult<News>> GetNews(int id)
    {
        var news = await _newsRepository.GetByIdAsync(id);

        if (news == null)
        {
            return NotFound();
        }

        return Ok(news);
    }

    // POST: api/News
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<News>> PostNews(NewsCreateDto newsCreateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var news = newsCreateDto.ToNews();
        var createdNews = await _newsRepository.AddAsync(news);

        return CreatedAtAction(nameof(GetNews), new { id = createdNews.Id }, createdNews);
    }

    // PUT: api/News/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutNews(int id, NewsUpdateDto newsUpdateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingNews = await _newsRepository.GetByIdAsync(id);
        if (existingNews == null)
        {
            return NotFound();
        }

        existingNews = newsUpdateDto.ToNews(existingNews);
        await _newsRepository.UpdateAsync(existingNews);

        return NoContent();
    }

    // DELETE: api/News/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        var result = await _newsRepository.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}

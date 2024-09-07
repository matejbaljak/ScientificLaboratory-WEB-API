using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLaboratory_new_with_dto.DTOs;
using ScientificLaboratory_new_with_dto.Models;
using ScientificLaboratory_new_with_dto.Repositories;
using ScientificLaboratory_new_with_dto.Repository.Interfaces;
using System.Threading.Tasks;

namespace ScientificLaboratory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectsController(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        [Authorize]
        [HttpPost("CreateWithResearchers")]
        public async Task<IActionResult> CreateProjectWithResearchers(ProjectWithResearchersDto projectDto)
        {
            var project = await _projectRepository.CreateProjectWithResearchers(projectDto);
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _projectRepository.GetProject(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _projectRepository.GetAllProjects();
            return Ok(projects);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectWithResearchersDto projectDto)
        {
            try
            {
                await _projectRepository.UpdateProject(id, projectDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                await _projectRepository.DeleteProject(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("{id}/description")]
        public async Task<IActionResult> GetProjectDescription(int id)
        {
            try
            {
                var description = await _projectRepository.GetProjectDescription(id);
                return Ok(description);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}

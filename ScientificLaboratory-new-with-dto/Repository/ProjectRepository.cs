using Microsoft.EntityFrameworkCore;
using ScientificLaboratory_new_with_dto.Data;
using ScientificLaboratory_new_with_dto.DTOs;
using ScientificLaboratory_new_with_dto.Models;
using ScientificLaboratory_new_with_dto.Mapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScientificLaboratory.Models;
using ScientificLaboratory_new_with_dto.Repository.Interfaces;

namespace ScientificLaboratory_new_with_dto.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Project> CreateProjectWithResearchers(ProjectWithResearchersDto projectDto)
        {
            var project = ProjectMapper.MapProjectWithResearchersDtoToProject(projectDto);

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectResearchers)
                .ThenInclude(pr => pr.Researcher)
                .Include(p => p.Funding)
                .ThenInclude(f => f.FundingbyYears)
                .FirstOrDefaultAsync(p => p.Id == id);

            return project;
        }

        public async Task<IEnumerable<Project>> GetAllProjects()
        {
            return await _context.Projects
                .Include(p => p.ProjectResearchers)
                .ThenInclude(pr => pr.Researcher)
                .Include(p => p.Funding)
                .ThenInclude(f => f.FundingbyYears)
                .ToListAsync();
        }

        public async Task UpdateProject(int id, ProjectWithResearchersDto projectDto)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectResearchers)
                .ThenInclude(pr => pr.Researcher)
                .Include(p => p.Funding)
                .ThenInclude(f => f.FundingbyYears)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found");
            }

            project.Title = projectDto.Title;
            project.Description = projectDto.Description;
            project.StartMonth = projectDto.StartMonth;
            project.StartYear = projectDto.StartYear;
            project.EndMonth = projectDto.EndMonth;
            project.EndYear = projectDto.EndYear;
            project.Type = projectDto.Type;
            project.ProjectLeader = projectDto.ProjectLeader;

            if (project.Funding == null)
            {
                project.Funding = new Funding();
            }

            project.Funding.Source = projectDto.Funding.Source;
            project.Funding.SponsorName = projectDto.Funding.SponsorName;
            project.Funding.FundingbyYears = projectDto.Funding.FundingbyYears?.Select(f => new FundingByYear
            {
                Year = f.Year,
                Amount = f.Amount
            }).ToList();

            _context.ProjectResearchers.RemoveRange(project.ProjectResearchers);
            await _context.SaveChangesAsync();

            project.ProjectResearchers = projectDto.Researchers?.Select(r => new ProjectResearcher
            {
                ProjectId = project.Id,
                Researcher = new Researcher
                {
                    Name = r.Name,
                    Institution = r.Institution
                }
            }).ToList();

            await _context.SaveChangesAsync();
        }

        public async Task DeleteProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectResearchers)
                .ThenInclude(pr => pr.Researcher)
                .Include(p => p.Funding)
                .ThenInclude(f => f.FundingbyYears)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found");
            }

            _context.ProjectResearchers.RemoveRange(project.ProjectResearchers);
            _context.Fundings.Remove(project.Funding);
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }

        public async Task<object> GetProjectDescription(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Funding)
                .ThenInclude(f => f.FundingbyYears)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Description,
                    Funding = p.Funding != null ? new
                    {
                        p.Funding.Source,
                        p.Funding.SponsorName,
                        p.Funding.TotalAmount,
                        FundingbyYears = p.Funding.FundingbyYears.Select(f => new { f.Year, f.Amount }).ToList()
                    } : null
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found");
            }

            return project;
        }
    }
}



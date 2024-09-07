using ScientificLaboratory.Models;
using ScientificLaboratory_new_with_dto.Dto;
using ScientificLaboratory_new_with_dto.DTOs;
using ScientificLaboratory_new_with_dto.Models;

namespace ScientificLaboratory_new_with_dto.Mapper
{
    public static class ProjectMapper
    {
        public static Project MapProjectWithResearchersDtoToProject(ProjectWithResearchersDto dto)
        {
            return new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                StartMonth = dto.StartMonth,
                StartYear = dto.StartYear,
                EndMonth = dto.EndMonth,
                EndYear = dto.EndYear,
                Type = dto.Type,
                ProjectLeader = dto.ProjectLeader,
                ProjectResearchers = dto.Researchers?.Select(r => new ProjectResearcher
                {
                    Researcher = new Researcher
                    {
                        Name = r.Name,
                        Institution = r.Institution
                    }
                }).ToList(),
                Funding = new Funding
                {
                    Source = dto.Funding.Source,
                    SponsorName = dto.Funding.SponsorName,
                    FundingbyYears = dto.Funding.FundingbyYears?.Select(f => new FundingByYear
                    {
                        Year = f.Year,
                        Amount = f.Amount
                    }).ToList()
                }
            };
        }

        public static ProjectWithResearchersDto MapProjectToProjectWithResearchersDto(Project project)
        {
            return new ProjectWithResearchersDto
            {
                Title = project.Title,
                Description = project.Description,
                StartMonth = project.StartMonth,
                StartYear = project.StartYear,
                EndMonth = project.EndMonth,
                EndYear = project.EndYear,
                Type = project.Type,
                ProjectLeader = project.ProjectLeader,
                Researchers = project.ProjectResearchers?.Select(pr => new ResearcherCreateDto
                {
                    Name = pr.Researcher.Name,
                    Institution = pr.Researcher.Institution
                }).ToList(),
                Funding = new FundingDTO
                {
                    Source = project.Funding.Source,
                    SponsorName = project.Funding.SponsorName,
                    FundingbyYears = project.Funding.FundingbyYears?.Select(f => new FundingByYearDTO
                    {
                        Year = f.Year,
                        Amount = f.Amount
                    }).ToList()
                }
            };
        }
    }
}

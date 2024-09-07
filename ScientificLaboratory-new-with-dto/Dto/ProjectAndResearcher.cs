using ScientificLaboratory_new_with_dto.Dto;
using ScientificLaboratory_new_with_dto.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class ProjectAndResearcher
    {
        [Required]
        [StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        [StringLength(100, ErrorMessage = "Institution length can't be more than 100.")]
        public string? Institution { get; set; }
    }

    public class ProjectWithResearchersDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Title length can't be more than 200.")]
        public string Title { get; set; }

        [Required]
        [StringLength(10000, ErrorMessage = "Description length can't be more than 1000.")]
        public string Description { get; set; }

        [Range(1, 12, ErrorMessage = "Start month must be between 1 and 12.")]
        public int? StartMonth { get; set; }

        [Required]
        [Range(1900, 2100, ErrorMessage = "Start year must be between 1900 and 2100.")]
        public int StartYear { get; set; }

        [Range(1, 12, ErrorMessage = "End month must be between 1 and 12.")]
        public int? EndMonth { get; set; }

        [Required]
        [Range(1900, 2100, ErrorMessage = "End year must be between 1900 and 2100.")]
        public int EndYear { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Type length can't be more than 50.")]
        public string Type { get; set; }

        [StringLength(100, ErrorMessage = "Project Leader length can't be more than 100.")]
        public string ProjectLeader { get; set; }

        public List<ResearcherCreateDto> Researchers { get; set; } = new List<ResearcherCreateDto>();

        [Required]
        public FundingDTO Funding { get; set; }

    }
}

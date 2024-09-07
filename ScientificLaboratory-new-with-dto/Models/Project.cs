using ScientificLaboratory_new_with_dto.DTOs;
using ScientificLaboratory_new_with_dto.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "Title length can't be more than 200.")]
        public string Title { get; set; }

        [Required]
        [StringLength(10000, ErrorMessage = "Description length can't be more than 1000.")]
        public string Description { get; set; }

        [Required]
        [Range(1, 12, ErrorMessage = "Start month must be between 1 and 12.")]
        public int? StartMonth { get; set; }

        [Required]
        [Range(1900, 2024, ErrorMessage = "Start year must be between 1900 and 2024.")]
        public int StartYear { get; set; }

        [Required]
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

        public List<ProjectResearcher> ProjectResearchers { get; set; } = new List<ProjectResearcher>();

        [Required]
        public Funding Funding { get; set; }

    }
}

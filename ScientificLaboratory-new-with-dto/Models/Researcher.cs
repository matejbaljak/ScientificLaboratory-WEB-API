using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class Researcher
    {
        public int ResearcherId { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        [StringLength(100, ErrorMessage = "Institution length can't be more than 100.")]
        public string? Institution { get; set; }

        public List<ProjectResearcher> ProjectResearchers { get; set; } = new List<ProjectResearcher>();
    }
}

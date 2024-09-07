using ScientificLaboratory.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class ProjectResearcher
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        [Required]
        public int ResearcherId { get; set; }
        public Researcher Researcher { get; set; }
    }
}
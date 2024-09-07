using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Dto
{
    public class ResearcherCreateDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Name length can't be more than 100.")]
        public string Name { get; set; }

        [StringLength(100, ErrorMessage = "Institution length can't be more than 100.")]
        public string? Institution { get; set; }
    }
}
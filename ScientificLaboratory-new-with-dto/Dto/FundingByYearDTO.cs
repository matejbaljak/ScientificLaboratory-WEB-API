using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Dto
{
    public class FundingByYearDTO
    {
        [Required]
        public int Year { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }
    }
}

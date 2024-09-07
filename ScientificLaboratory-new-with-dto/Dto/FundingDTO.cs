using ScientificLaboratory.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScientificLaboratory_new_with_dto.Dto
{
    public class FundingDTO
    {
        [Required]
        public string Source { get; set; }

        [Required]
        public string SponsorName { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one funding year is required.")]
        public List<FundingByYearDTO> FundingbyYears { get; set; }

        public decimal TotalAmount
        {
            get
            {
                return FundingbyYears?.Sum(f => f.Amount) ?? 0;
            }
        }


    }
}
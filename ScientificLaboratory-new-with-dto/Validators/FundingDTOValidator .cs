using FluentValidation;
using ScientificLaboratory_new_with_dto.Dto;

namespace ScientificLaboratory_new_with_dto.Validators
{

    public class FundingDTOValidator : AbstractValidator<FundingDTO>
        {
            public FundingDTOValidator()
            {
                RuleFor(x => x.Source).NotEmpty().WithMessage("Source is required.");
                RuleFor(x => x.SponsorName).NotEmpty().WithMessage("Sponsor Name is required.");
                RuleFor(x => x.FundingbyYears).NotEmpty().WithMessage("At least one funding year is required.");
                RuleForEach(x => x.FundingbyYears).SetValidator(new FundingByYearDTOValidator());
            }
        }

        public class FundingByYearDTOValidator : AbstractValidator<FundingByYearDTO>
        {
            public FundingByYearDTOValidator()
            {
                RuleFor(x => x.Year).GreaterThan(0).WithMessage("Year must be a positive number.");
                RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be greater than zero.");
            }
        }
    }

using ScientificLaboratory_new_with_dto.Dto;
using ScientificLaboratory_new_with_dto.Models;

namespace ScientificLaboratory_new_with_dto.Mapper
{
    public class MemberMapper
    {
        public static MemberDto ToDto(Member member)
        {
            return new MemberDto
            {
                Id = member.Id, // Include the ID
                Name = member.Name,
                Position = member.Position.ToString() // Convert enum to string
            };
        }

        public static Member ToEntity(MemberDto memberDto)
        {
            return new Member
            {
                Id = memberDto.Id, // Include the ID if you're using it in some scenarios
                Name = memberDto.Name,
                Position = Enum.Parse<Position>(memberDto.Position) // Convert string back to enum
            };
        }
    }
}

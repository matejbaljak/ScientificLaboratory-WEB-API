using ScientificLaboratory_new_with_dto.Models;

namespace ScientificLaboratory_new_with_dto.Repository.Interfaces
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllAsync();
        Task<Member> GetByIdAsync(int id);
        Task<Member> AddAsync(Member member);
        Task UpdateAsync(Member member);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}

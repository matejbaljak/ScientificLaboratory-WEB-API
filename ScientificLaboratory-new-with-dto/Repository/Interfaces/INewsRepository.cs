using ScientificLaboratory_new_with_dto.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScientificLaboratory_new_with_dto.Repositories
{
    public interface INewsRepository
    {
        Task<IEnumerable<News>> GetAllAsync();
        Task<News> GetByIdAsync(int id);
        Task<News> AddAsync(News news);
        Task<News> UpdateAsync(News news);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}

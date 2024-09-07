using ScientificLaboratory.Models;
using ScientificLaboratory_new_with_dto.Models;

namespace ScientificLaboratory_new_with_dto.Repository.Interfaces
{
    public interface IProjectRepository
    {
        Task<Project> CreateProjectWithResearchers(ProjectWithResearchersDto projectDto);
        Task<Project> GetProject(int id);
        Task<IEnumerable<Project>> GetAllProjects();
        Task UpdateProject(int id, ProjectWithResearchersDto projectDto);
        Task DeleteProject(int id);
        Task<object> GetProjectDescription(int id);
    }
}

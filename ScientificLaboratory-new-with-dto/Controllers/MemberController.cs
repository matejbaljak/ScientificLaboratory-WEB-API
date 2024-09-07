using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScientificLaboratory_new_with_dto.Dto;
using ScientificLaboratory_new_with_dto.Mapper;
using ScientificLaboratory_new_with_dto.Models;
using Microsoft.EntityFrameworkCore;
using ScientificLaboratory_new_with_dto.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace ScientificLaboratory_new_with_dto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly IMemberRepository _repository;

        public MembersController(IMemberRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers()
        {
            var members = await _repository.GetAllAsync();
            return members.Select(m => MemberMapper.ToDto(m)).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetMember(int id)
        {
            var member = await _repository.GetByIdAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            return MemberMapper.ToDto(member);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Member>> PostMember(MemberDto memberDto)
        {
            var member = MemberMapper.ToEntity(memberDto);
            await _repository.AddAsync(member);

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
        }

        [Authorize]
        // PUT: api/Members/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMember(int id, MemberDto memberDto)
        {
            var existingMember = await _repository.GetByIdAsync(id);
            if (existingMember == null)
            {
                return NotFound();
            }

            existingMember.Name = memberDto.Name;
            existingMember.Position = Enum.Parse<Position>(memberDto.Position);

            try
            {
                await _repository.UpdateAsync(existingMember);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.ExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize]
        // DELETE: api/Members/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _repository.GetByIdAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}


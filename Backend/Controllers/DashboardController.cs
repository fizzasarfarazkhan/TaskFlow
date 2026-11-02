using BackendTask.Model;
using BackendTask.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(role) || string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Invalid token data." });
        }

        var tasksQuery = _context.Tasks.AsQueryable();

        // Regular users see tasks they created or that are assigned to them.
        if (role != "Admin")
        {
            tasksQuery = tasksQuery.Where(t =>
                t.CreatedByUserId == userId ||
                t.AssignedToUserId == userId);
        }

        var tasks = await tasksQuery.ToListAsync();

        var taskCounts = new
        {
            completed = tasks.Count(t =>
                string.Equals(t.Status?.Trim(), "Completed",
                    StringComparison.OrdinalIgnoreCase)),

            inProgress = tasks.Count(t =>
                string.Equals(t.Status?.Trim(), "In Progress",
                    StringComparison.OrdinalIgnoreCase) ||
                string.Equals(t.Status?.Trim(), "InProgress",
                    StringComparison.OrdinalIgnoreCase)),

            pending = tasks.Count(t =>
                string.Equals(t.Status?.Trim(), "Pending",
                    StringComparison.OrdinalIgnoreCase))
        };

        return Ok(new
        {
            role,
            taskCounts
        });
    }
}
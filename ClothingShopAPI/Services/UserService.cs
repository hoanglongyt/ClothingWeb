using ClothingShopAPI.Models;
using ClothingShopAPI.Repositories;
using ClothingShopAPI.Data;

namespace ClothingShopAPI.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;

        public UserService(IUserRepository userRepository, ApplicationDbContext context)
        {
            _userRepository = userRepository;
            _context = context;

            // Kiểm tra và tạo admin nếu chưa có
            Task.Run(async () => await EnsureAdminCreatedAsync()).Wait();
        }

        private async Task EnsureAdminCreatedAsync()
        {
            var adminUser = await _userRepository.GetByUsernameAsync("admin");
            if (adminUser == null)
            {
                var admin = new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    FullName = "Admin User",
                    Address = "123 Admin St",
                    Phone = "0987654321",
                    Role = "Admin"
                };

                await _userRepository.AddAsync(admin);
            }
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await _userRepository.AddAsync(user);
        }

        public async Task<bool> UpdateUserAsync(int id, User user)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
                return false;

            user.Id = id;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return false;

            await _userRepository.DeleteAsync(id);
            return true;
        }
    }
}

﻿namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        Task<bool> SaveAsync();
    }
}

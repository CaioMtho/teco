namespace TecoApi.Data;

using TecoApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

public class TecoContext(DbContextOptions<TecoContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Requester> Requesters { get; set; }
    public DbSet<Provider> Providers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Proposal> Proposals { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Request>()
            .Property(r => r.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Order>()
            .Property(o => o.PaymentStatus)
            .HasConversion<string>();

        modelBuilder.Entity<Proposal>()
            .HasOne(p => p.ChatMessage)
            .WithOne(cm => cm.Proposal)
            .HasForeignKey<Proposal>(p => p.ChatMessageId)
            .OnDelete(DeleteBehavior.SetNull);


        modelBuilder.Entity<User>()
            .HasOne(u => u.Provider)
            .WithOne(p => p.User)
            .HasForeignKey<Provider>(p => p.UserId);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Requester)
            .WithOne(r => r.User)
            .HasForeignKey<Requester>(r => r.UserId);

        modelBuilder.Entity<User>()
            .HasOne(u => u.PersonalAddress)
            .WithOne()
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Provider>()
            .HasOne(p => p.WorkAddress)
            .WithOne()
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.ServiceAddress)
            .WithOne()
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Proposal)
            .WithOne(p => p.Order)
            .HasForeignKey<Order>(o => o.ProposalId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Provider)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Requester)
            .WithMany(req => req.Reviews)
            .HasForeignKey(r => r.RequesterId)
            .OnDelete(DeleteBehavior.Cascade);


        base.OnModelCreating(modelBuilder);
    }
}
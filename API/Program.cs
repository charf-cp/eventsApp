using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(option => option.AllowAnyHeader().AllowAnyMethod()
                      .WithOrigins("http://localhost:3000"));



app.MapControllers();//Routing

using var scope = app.Services.CreateScope();//
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync(); //apply migration and create databse if doesnt exist 
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{

    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error during migration!");
}

app.Run();

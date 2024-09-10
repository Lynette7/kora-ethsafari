import pygame
import math
import random

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
CAR_WIDTH = 30
CAR_HEIGHT = 20
FONT_SIZE = 18
ROAD_COLOR = (100, 100, 100)
GRASS_COLOR = (0, 200, 0)
LANE_COLOR = (255, 255, 255)


# Configurations
Alchemy_url="https://eth-sepolia.g.alchemy.com/v2/ZEU_8jagN2poKTL2BsOoI35Fw8LgVI1G"
Private_key="48f12fe4b6e4d9c6bf5f5e383242be6c67a6692b269d0bda1142bf59c0a9444a"
class Car:
    def __init__(self, x, y, speed, color, is_player=False):
        self.x = x
        self.y = y
        self.speed = speed
        self.color = color
        self.rect = pygame.Rect(self.x, self.y, CAR_WIDTH, CAR_HEIGHT)
        self.is_player = is_player
        self.current_speed = 0
        self.speed_history = []

    def update_position(self, dx, dy):
        self.x += dx
        self.y += dy
        self.rect.topleft = (self.x, self.y)
        self.current_speed = math.sqrt(dx**2 + dy**2) * 30  # Convert to pixels per second
        self.speed_history.append(self.current_speed)

    def get_position(self):
        return (self.x, self.y)

    def get_speed(self):
        return self.current_speed

    def get_average_speed(self):
        if len(self.speed_history) > 0:
            return sum(self.speed_history) / len(self.speed_history)
        return 0

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)

class CarGame:
    def __init__(self):
        self.cars = []
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Car Game")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, FONT_SIZE)
        self.road_y = SCREEN_HEIGHT // 2 - 100
        self.road_height = 200
        self.game_over = False

    def add_car(self, car):
        self.cars.append(car)

    def draw_road(self):
        self.screen.fill(GRASS_COLOR)
        pygame.draw.rect(self.screen, ROAD_COLOR, (0, self.road_y, SCREEN_WIDTH, self.road_height))
        for i in range(0, SCREEN_WIDTH, 50):
            pygame.draw.rect(self.screen, LANE_COLOR, (i, self.road_y + self.road_height // 2 - 2, 30, 4))

    def run(self):
        player_car = self.cars[0]
        cpu_car = self.cars[1]

        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            if not self.game_over:
                # Player car control
                keys = pygame.key.get_pressed()
                dx, dy = 0, 0
                if keys[pygame.K_LEFT]:
                    dx -= 5
                if keys[pygame.K_RIGHT]:
                    dx += 5
                if keys[pygame.K_UP]:
                    dy -= 5
                if keys[pygame.K_DOWN]:
                    dy += 5
                player_car.update_position(dx, dy)

                # Computer car control (simple following behavior)
                cpu_dx = (player_car.x - cpu_car.x) / 30
                cpu_dy = (player_car.y - cpu_car.y) / 30
                cpu_car.update_position(cpu_dx, cpu_dy)

                # Keep cars within road bounds
                for car in self.cars:
                    car.x = max(0, min(car.x, SCREEN_WIDTH - CAR_WIDTH))
                    car.y = max(self.road_y, min(car.y, self.road_y + self.road_height - CAR_HEIGHT))
                    car.rect.topleft = (car.x, car.y)

                # Check for collision
                if cpu_car.rect.colliderect(player_car.rect):
                    self.game_over = True

            self.draw_road()

            for car in self.cars:
                car.draw(self.screen)
                speed_text = self.font.render(f"Speed: {car.get_speed():.2f}", True, (0, 0, 0))
                self.screen.blit(speed_text, (car.x, car.y - 20))

            if self.game_over:
                game_over_text = self.font.render("Game Over! Computer car hit the player car.", True, (255, 0, 0))
                self.screen.blit(game_over_text, (SCREEN_WIDTH // 2 - 200, SCREEN_HEIGHT // 2 - 50))
                
                avg_speed_text = self.font.render(f"Player's Average Speed: {player_car.get_average_speed():.2f}", True, (0, 0, 0))
                self.screen.blit(avg_speed_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2))

                pygame.display.flip()
                self.clock.tick(30)

                # Wait for the player to close the window
                waiting = True
                while waiting:
                    for event in pygame.event.get():
                        if event.type == pygame.QUIT:
                            waiting = False
                            running = False

            else:
                pygame.display.flip()
                self.clock.tick(30)

        pygame.quit()

# Example usage
if __name__ == "__main__":
    game = CarGame()
    player_car = Car(100, SCREEN_HEIGHT // 2, 100, (255, 0, 0), is_player=True)
    cpu_car = Car(700, SCREEN_HEIGHT // 2 + 50, 120, (0, 0, 255))
    game.add_car(player_car)
    game.add_car(cpu_car)
    game.run()
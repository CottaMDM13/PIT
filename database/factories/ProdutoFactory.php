<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Categoria;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nome = $this->faker->word();
        $userIds = User::pluck('id');
        $categoriaIds = Categoria::pluck('id');

        if ($userIds->isEmpty() || $categoriaIds->isEmpty()) {
            throw new \Exception("Users or categories table is empty");
        }

        return [
            'nome' => $nome,
            'descricao' => $this->faker->paragraph(),
            'preco' => $this->faker->randomFloat(2, 1, 100),
            'slug' => Str::slug($nome),
            'imagem' => $this->faker->imageUrl(400, 400),
            'id_user' => $userIds->random(),
            'id_categoria' => $categoriaIds->random(),
        ];
    }
}

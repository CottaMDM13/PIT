<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;
use App\Models\Categoria;
use Illuminate\Support\Facades\Gate;

class SiteController extends Controller
{
    protected $categoriasMenu;

    public function __construct()
    {
        $this->categoriasMenu = Categoria::all();
        view()->share('categoriasMenu', $this->categoriasMenu);
    }

    public function index()
    {
        $produtos = Produto::all();
        return view('site.home', compact('produtos'));
    }

    public function details($slug) 
    {
        $produto = Produto::where('slug', $slug)->first();
        Gate::authorize('ver-produto', $produto); 
        return view('site.details', compact('produto'));
    }

    public function categoria($id) 
    {
        $categoria = Categoria::find($id);
        $produtos = Produto::where('id_categoria', $id)->get();
        return view('site.categoria', compact('produtos', 'categoria'));
    }

}

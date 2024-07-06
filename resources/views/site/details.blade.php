@extends('site.layout')
@section('title', 'Details')
@section('conteudo')

<div class="row container"> <br>
    <div class="col s12 m6">
        <img src="{{$produto->imagem}}" class="responsive-img">
    </div>
    <div class="col s12 m6">
        <h4> {{$produto->nome}} </h4>
        <h4> R$ {{number_format($produto->preco, 2, ',', '.')}} </h4>
        <p> {{$produto_descricao}} </p>
        <p> Postado por: {{$produto->user->firstName}} <br>
            Categoria: {{ $prosuto->categoria->nome }}
        </p>

        <form action="{{route('site.addcarrinho')}}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="id" value="{{$produto->id}}">
            <input type="hidden" name="name" value="{{$produto->nome}}">
            <input type="hidden" name="price" value="{{$produto->preco}}">
            <input type="hidden" min="1" name="qnt" value="1">
            <input type="hidden" name="img" value="{{$produto->imagem}}">
        </form>
        <button class="btn orange btn-large">Comprar</button>
    </div>    

</div>

@endsection
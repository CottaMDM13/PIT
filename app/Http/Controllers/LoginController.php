<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function auth(Request $request) {
        $credenciais = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'O campo email e obrigatorio!',
            'email.email' => 'O email nao e valido',
            'password.required' => 'O campo senha e obrigatorio!'
        ]);

        if(Auth::attempt($credenciais, $request->remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/admin/dashboard');
        } else {
            return redirect()->back()->with('erro', 'Usuario ou senha invalida.');
        };
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request-session()->regenerateToken();
        return redirect('site.index');
    }

    public function create(){
        return view('login.create');
    }

}

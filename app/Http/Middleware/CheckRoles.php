<?php

namespace App\Http\Middleware;

use Closure;

class CheckRoles
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // if (!$request->user()->hasRole($role)) {
        //     // Redirect...
        $this->middleware('roles:Administrateur' | 'Gestionnaire' | 'Client' | 'Agent');
        $roleArray = explode('|', $roles);

        if (!$request->user()->hasAnyRoles($roleArray)) {
            return redirect()->route('home')->with(['permission' => 'Action non autorisée']);
        }
    }
}

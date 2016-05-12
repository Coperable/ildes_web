<?php
use Illuminate\Database\Seeder;
use Slam\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder {

    public function run() {
        DB::table('users')->delete();

        $user = new User();
        $user->username = 'Leo';
        $user->email = 'aito0077@gmail.com';
        $user->password = Hash::make('kierkegaard');
        $user->save();

        $user = new User();
        $user->username = 'usuario1';
        $user->email = 'usuario1@test.com';
        $user->password = Hash::make('usuario1');
        $user->save();

        $user = new User();
        $user->username = 'neal';
        $user->email = 'neal@test.com';
        $user->name = 'Neal';
        $user->lastname = 'Gorenflo';
        $user->place = 'USA';
        $user->about = 'Acerca de Neal';
        $user->password = Hash::make('dummy');
	$user->participant = true;
        $user->save();


    }

}



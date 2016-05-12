<?php
use Illuminate\Database\Seeder;
use Slam\User;
use Slam\Model\UserRegion;
use Slam\Model\Region;
use Illuminate\Support\Facades\Hash;


class RegionsTableSeeder extends Seeder {

    public function run() {
        DB::table('regions')->delete();

        $region = new Region();
        $region->code = 'ARG';
        $region->name = 'Global';
        $region->description = 'Global';
        $region->color = '#37ABC8';
        $region->icon = 'argentina';
        $region->save();

        $region = new Region();
        $region->code = 'CCC';
        $region->name = 'Centro Cultural de la Cooperación';
        $region->description = 'Centro Cultural de la Cooperación';
        $region->color = '#EE441E';
        $region->icon = 'cordoba';
        $region->parent_id = 1;
        $region->save();

        $region = new Region();
        $region->code = 'IG';
        $region->name = 'Instituto Goethe';
        $region->description = 'Instituto Goethe';
        $region->color = '#8FC521';
        $region->icon = 'santa_fe';
        $region->parent_id = 1;
        $region->save();

        $region = new Region();
        $region->code = 'LUC';
        $region->name = 'La Usina Cultura';
        $region->description = 'La Usina Cultura';
        $region->color = '#F3558A';
        $region->icon = 'mendoza';
        $region->parent_id = 1;
        $region->save();

        $region = new Region();
        $region->code = 'CCM';
        $region->name = 'Club Cultural Matienzo';
        $region->description = 'Club Cultural Matienzo';
        $region->color = '#F3558A';
        $region->icon = 'chubut';
        $region->parent_id = 1;
        $region->save();


    }

}




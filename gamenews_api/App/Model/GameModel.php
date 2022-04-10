<?php
  namespace App\Model;
  use App\Entity\Game;

  class GameModel{
    private $fileName;
    private $listGame = [];//Object type Game

    public function __construct(){
      $this->fileName = "../database/carro.db";
    }

    public function create(Game $game){
      $this->listGame[] = $game;
      $this->save();

      return "ok";
    }

    private function save(){
        $temp = [];

        foreach($this->listGame as $g){
          $temp[] = [
            "id" => $g->getId(),
            "titulo" => $g->getTitulo(),
            "descricao" => $g->getDescricao(),
            "videoid" => $g->getVideoid(),
          ];

          $fp = fopen($this->fileName, "w");
          fwrite($fp, json_encode($temp));
          fclose($fp);
        }
    }

    private function load(){

    }

  }
?>

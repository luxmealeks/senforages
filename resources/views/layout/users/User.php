<?php

require_once 'Dbs.php';
class User
{
    public $id;
    public $nom;
    public $prenom;
    public $email;
    public $created_at;
    public $updated_at;
    private static $select_user_sql = 'SELECT id,nom, prenom, email,created_at,updated_at FROM users WHERE id = :user';
    private static $select_all_users_sql = 'SELECT id,nom, prenom, email,created_at,updated_at FROM users';
    private static $select_all_users_start_offset = 'SELECT id,nom, prenom, email,created_at,updated_at FROM users LIMIT :start , :offset';
    private static $insert_sql = 'INSERT INTO `users` (`nom`, `prenom`, `email`) VALUES (:nom, :prenom, :email)';
    private static $delete_sql = 'DELETE FROM `users` WHERE `id`=:id';
    private static $search_sql = 'SELECT id,nom, prenom, email,created_at,updated_at FROM `users` WHERE `nom` LIKE :nom OR `prenom` LIKE :prenom';
    private static $update_sql = 'UPDATE `users` SET `nom` = :nom , `prenom` = :prenom , `email` = :email WHERE `users`.`id` = :id';

    public function __construct($nom = null, $prenom = null, $email = null)
    {
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->email = $email;
    }

    public static function find($id): User
    {
        $user = new User();
        $preparedStatement = Db::getInstance()->prepare(self::$select_user_sql);
        $preparedStatement->execute(['user' => $id]); // associative array
        $result = $preparedStatement->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            foreach ($result as $key => $value) {
                $user->$key = $value;
            }

            return $user;
        }

        return new User();
    }

    public static function get($start = null, $offset = null)
    {
        if (isset($start) && isset($offset)) {
            $preparedStatement = Db::getInstance()->prepare(self::$select_all_users_start_offset);
            $preparedStatement->bindValue(':start', $start, PDO::PARAM_INT);
            $preparedStatement->bindValue(':offset', $offset, PDO::PARAM_INT);
            // $preparedStatement->execute([
            //     'start'=> (int) 1,//(int)$start,
            //     'offset'=>(int)2,// (int)$offset,
            // ]);
            $preparedStatement->execute();
        } else {
            $preparedStatement = Db::getInstance()->query(self::$select_all_users_sql);
        }
        $result = $preparedStatement->fetchAll(PDO::FETCH_ASSOC);
        $users = [];
        foreach ($result as $user_array) {
            $user = new User();
            foreach ($user_array as $key => $value) {
                $user->$key = $value;
            }
            $users[] = $user;
        }

        return $users;
    }

    public static function search($nom, $prenom)
    {
        $preparedStatement = Db::getInstance()->prepare(self::$search_sql);
        $preparedStatement->execute([
            'nom' => $nom,
            'prenom' => $prenom,
        ]);
        $result = $preparedStatement->fetchAll(PDO::FETCH_ASSOC);
        $users = [];
        foreach ($result as $user_array) {
            $user = new User();
            foreach ($user_array as $key => $value) {
                $user->$key = $value;
            }
            $users[] = $user;
        }

        return $users;
    }

    public function save()
    {
        $pdo = Db::getInstance();
        if (isset($this->id)) {
            $preparedStatement = $pdo->prepare(self::$update_sql);
            $preparedStatement->execute([
                'id' => $this->id,
                'nom' => $this->nom,
                'prenom' => $this->prenom,
                'email' => $this->nom.'@'.$this->prenom.'.com',
            ]);
        } else {
            $preparedStatement = $pdo->prepare(self::$insert_sql);
            $preparedStatement->execute([
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->nom.'@'.$this->prenom.'.com',
             ]);
            $saved_user = User::find($pdo->lastinsertid());
            foreach ($saved_user as $key => $value) {
                $this->$key = $value;
            }
        }
    }

    public function delete()
    {
        $pdo = Db::getInstance();
        $preparedStatement = $pdo->prepare(self::$delete_sql);
        $preparedStatement->execute([
            'id' => $this->id,
        ]);
    }
}

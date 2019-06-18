<?php
class Db
{
    public static $pdo = null;
    public static $instance = null;

    private static $host = 'localhost';
    private static $database = 'gestionforage';
    private static $user = 'babacar';
    private static $password = 'passer';
    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$pdo;
    }
    private function __construct()
    {
        $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$database . ";charset=utf8";
        self::$pdo = new PDO($dsn, self::$user, self::$password,array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ));
    }


    public static function initialize()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$pdo;
    }
}

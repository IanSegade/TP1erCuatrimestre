import { Client } from "pg";

const config = {
  host: "aws-0-sa-east-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.wjqvqngievjqjsceogqa",
  password: "skibidiMortis",
};

const client = new Client(config);
export default client;
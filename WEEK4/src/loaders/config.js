import readline from "readline";
import dotenv from "dotenv";
import path from "path";

function askEnvironment() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Choose environment (local / dev / prod): ", (answer) => {
      rl.close();

      const env = answer.trim();
      if (!["local", "dev", "prod"].includes(env)) {
        console.log("Invalid input. Defaulting to 'local'.");
        resolve("local");
      } else {
        console.log(`Setting environment to ${env}`);
        resolve(env);
      }
    });
  });
}

let env = process.env.NODE_ENV;
if (!env) {
  env = await askEnvironment();
}

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
  quiet:true
});

const config = {
  env,
  port: process.env.PORT,
  dbUri: process.env.DB_URI
};

export default config;
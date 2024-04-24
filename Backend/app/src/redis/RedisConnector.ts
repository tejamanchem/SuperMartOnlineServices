import redis from "ioredis";
import { logger as log } from "./../logger/logger";
import { getTypeErrorMessage } from "./../utils/genericUtils";

export class RedisConnector {
  private redisClient: redis;
  private static instance: RedisConnector;

  private constructor() {
    this.redisClient = new redis(this.getConfiguration());
    this.redisClient.on("error", (err: any) =>
      log.error(`Redis Client Error, ${err}`)
    );
  }

  public static getInstance() {
    try {
      log.info(`RedisConnector : In getInstance getting instance of the class`);
      if (this.instance) {
        log.info(`RedisConnector : Instance found returning same instance `);
        return this.instance;
      }
      log.info(`RedisConnector : Instance not found returning new instance `);
      return (this.instance = new RedisConnector());
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In getInstance error while getting instance of the class with  error : ${mainError}`
      );
      throw mainError;
    }
  }

  public async getKey(key: string, requestId?: any) {
    try {
      log.info(
        `RedisConnector : In getKey getting redis key with key : ${key} and requestId : ${requestId}`
      );
      let redisResponse = await this.redisClient.get(key, (error, result) => {
        if (error) {
          log.error(
            `RedisConnector : Error In getKey getting redis key with key : ${key} error : ${error} and requestId : ${requestId} `
          );
        } else {
          log.info(
            `RedisConnector : In getKey found the redis key : ${key} and requestId : ${requestId}`
          );
          return result;
        }
      });
      return redisResponse;
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In getKey error while getting redis key with key : ${key} error : ${mainError} and requestId : ${requestId}`
      );
      throw mainError;
    }
  }

  public setKey(
    key: string,
    value: string,
    expiryTime: number,
    requestId?: any
  ) {
    try {
      log.info(
        `RedisConnector : In setKey setting redis key with key : ${key} and value : ${value} and requestId : ${requestId} `
      );
      return this.redisClient.set(key, value, (error, result) => {
        if (error) {
          log.error(
            `RedisConnector : Error In setKey redis key with key : ${key} and value : ${value} and requestId : ${requestId} `
          );
        } else {
          if (expiryTime) this.redisClient.expire(key, expiryTime);
          return result;
        }
      });
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In setKey error while getting redis key with key : ${key} error : ${mainError} and requestId : ${requestId}`
      );
      throw mainError;
    }
  }

  private getConfiguration() {
    try {
      log.info(
        `RedisConnector : In getConfiguration getting configurations for the redis`
      );
      if (process.env.NODE_ENV == "dev") {
        return {};
      } else {
        let configuration = {
          host: process.env.REDIS_HOST,
          slave1: process.env.REDIS_SLAVE1,
          slave2: process.env.REDIS_SLAVE2,
          masterName: process.env.REDIS_MASTER,
          password: process.env.REDIS_PASSWORD,
          port: Number(process.env.REDIS_PORT),
        };
        return configuration;
      }
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In getConfiguration error while getting configurations error : ${mainError}`
      );
      throw mainError;
    }
  }

  public async deleteKey(key: string, requestId?: any) {
    try {
      log.info(
        `RedisConnector : In deleteKey : RedisKey: ${key} request received to delete key with requestId : ${requestId}`
      );
      let response = await this.redisClient.del(key);
      log.info(`RedisKey Deletion Successful : ${response == 1}`);
      return { response: `RedisKey ${key} deleted ${response}` };
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In deleteKey error while deleting redis key with key : ${key} error : ${mainError} and requestId : ${requestId}`
      );
      throw mainError;
    }
  }

  public async getAllKeys(requestId?: any) {
    try {
      log.info(
        `RedisConnector : In getAllKeys : Getting all keys with requestId :${requestId}`
      );
      let response = await this.redisClient.keys("*");
      return { response: response };
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In getAllKeys error while getting all redis key with error : ${mainError} and requestId : ${requestId}`
      );
      throw mainError;
    }
  }

  public async deleteAllKeys(requestId?: any) {
    try {
      log.info(
        `RedisConnector : In deleteAllKeys : deleting all keys with requestId :${requestId}`
      );
      let response = await this.redisClient.keys("*");
      for (let i = 0; i < response.length; i++) {
        await this.redisClient.del(response[i], function (err, reply) {
          if (err) {
            throw getTypeErrorMessage(err);
          }
        });
      }
      return { response: response };
    } catch (error: any) {
      let mainError = getTypeErrorMessage(error);
      log.error(
        `RedisConnector : Error In deleteAllKeys error while deleting all redis keys with error : ${mainError} and requestId : ${requestId}`
      );
      throw mainError;
    }
  }
}

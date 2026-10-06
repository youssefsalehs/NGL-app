class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }
  log(level, message, metaData = {}) {
    let mesageObject = {
      level,
      message,
      metaData,
      timeStamp: new Date().toISOString(),
      ...metaData,
    };
    console.log(JSON.stringify(mesageObject));
  }
  info(message, metaData = {}) {
    this.log("info", message, metaData);
  }
  error(message, metaData = {}) {
    this.log("error", message, metaData);
  }
  debug(message, metaData = {}) {
    this.log("debug", message, metaData);
  }
}

export const logger = new Logger();

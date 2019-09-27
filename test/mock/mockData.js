export const responseObject = {
  data: null,
  body: {},
  json: object => {
    this.data = object;
    return object;
  },
  download: (file, callback) => {}
};

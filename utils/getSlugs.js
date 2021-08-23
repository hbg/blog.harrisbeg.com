const getSlugs = (context) => {
  const keys = context.keys();
  let data = keys.map((key, index) => {
    return key.replace(/^.*[\\\/]/, '').slice(0, -3);
  })
  return data;
}

export default getSlugs

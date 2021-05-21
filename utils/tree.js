const transferOrgTree = (data) => {
  const newData = data;
  newData.label = newData.name;
  newData.value = newData.id;
  if (newData.children.length > 0) {
    newData.children.forEach((item) => transferOrgTree(item));
  }
  Object.keys(newData).forEach((item) => {
    if (item !== 'label' && item !== 'value' && item !== 'children') delete newData[item];
    if (item === 'children' && newData[item].length === 0) {
      delete newData[item];
    }
  });
  return newData;
};
module.exports={
  transferOrgTree
}
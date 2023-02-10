
const git_org = 'https://api.github.com';
const git = {
  search: git_org + '/search/users?q=',
  user: git_org + '/user/'
}
const regex = `^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$`;

module.exports = {
  git: git,
  regex: regex
}
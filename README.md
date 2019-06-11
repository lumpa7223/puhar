# puhar
Using puppeteer capturer harfile

## Install nodejs 10
* Add NodeSource binary distributions repository.
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash
```
* Install compile tools and node
```bash
sudo apt update
sudo apt -y install gcc g++ make
sudo apt -y install nodejs
```
* Install Yarn package manager
```bash
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

## Download puhar and dependencies
```bash
git clone https://github.com/lumpa7223/puhar.git
```
```bash
cd puhar
yarn install
```

## Install puppeteer OS level dependencies
```bash
yarn apt-require
```

## Capturer har file
```bash
usage: yarn start <http or https target>

yarn start https://www.google.com
```

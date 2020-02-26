#### 0.6.1 (2020-02-26)

##### Chores

* **release:**  compile latest source & release notes ([4ecf3eb6](https://github.com/codetanzania/ewea-common/commit/4ecf3eb6634071d17b5456bdd953f20047aa4af5))
* **deps:**  force latest version & audit fix ([c7e030f5](https://github.com/codetanzania/ewea-common/commit/c7e030f569d6a85d515440ad4ecc11f47dd25fb2))

#### 0.6.0 (2020-02-24)

##### Chores

* **deps:**
  *  force latest version & audit fix ([a0967f9d](https://github.com/codetanzania/ewea-common/commit/a0967f9de04faa1d324c4e608938c580be0813c0))
  *  force latest version & audit fix ([9ee59a76](https://github.com/codetanzania/ewea-common/commit/9ee59a76dfa848bf2457bf67bf07f25b1b8a31ea))

##### New Features

* **seed:**
  *  ensure name from event action catalogue:action ([ea0333db](https://github.com/codetanzania/ewea-common/commit/ea0333db1c0e0e3ea8778e7c6db47eed9dab0f66))
  *  support location and centroid geo fields parsing ([c077c689](https://github.com/codetanzania/ewea-common/commit/c077c6893b35986f695ca28d4d2ecb030ecc820d))
  *  transform geo fields ([77546447](https://github.com/codetanzania/ewea-common/commit/77546447c096a28cf577dc83744651c60c018489))

#### 0.5.4 (2020-02-22)

##### Chores

* **deps:**
  *  force latest version & audit fix ([9c36bad8](https://github.com/codetanzania/ewea-common/commit/9c36bad86c890a653c820866a4602c53530e6919))
  *  force latest version & audit fix ([23cdd98a](https://github.com/codetanzania/ewea-common/commit/23cdd98a4a0f9bc9b8c2dff1e02ab2dddf70b32b))

##### New Features

* **seed:**  add event action catalogue seeder ([e2117dd9](https://github.com/codetanzania/ewea-common/commit/e2117dd92249de4002cff83ff8fe34b94970a353))

##### Refactors

* **seed:**
  *  add question topic ([fb2501a7](https://github.com/codetanzania/ewea-common/commit/fb2501a74a3cc78a76c48b7ce22fedb764e9b1c7))
  *  add level to event ([0e54b842](https://github.com/codetanzania/ewea-common/commit/0e54b842e4fc48e6f6da85d0ed5fde0235dac26e))
  *  implement seed action for eventlevels ([e0219ec1](https://github.com/codetanzania/ewea-common/commit/e0219ec1ef218e8eecf016f52090b68a79636813))
* **eventtopics:**  implement seed for eventtopics ([429c74ec](https://github.com/codetanzania/ewea-common/commit/429c74ec0fb6be8ff307e05500e48abd9911bc3b))

##### Tests

* **fixtures:**  retain only one seed on event levels ([9e605ded](https://github.com/codetanzania/ewea-common/commit/9e605ded636b43ff55840d9cd508153eba4dc8d5))

#### 0.5.3 (2020-02-19)

##### Chores

* **deps:**  force latest version & audit fix ([9ced9e3b](https://github.com/codetanzania/ewea-common/commit/9ced9e3ba3bf01daabe06b99ef5a24ee67dbc885))

#### 0.5.2 (2020-02-19)

##### Chores

* **deps:**
  *  force latest version & audit fix ([288a4a7b](https://github.com/codetanzania/ewea-common/commit/288a4a7b53569979b94dae14660377a8f00a3e32))
  *  force latest version & audit fix ([9d05554c](https://github.com/codetanzania/ewea-common/commit/9d05554c3db3df00f2f4e524b3ed10d62f7d814d))
  *  force latest version & audit fix ([2ec74aa1](https://github.com/codetanzania/ewea-common/commit/2ec74aa134f90741b99e08350895a49d43d43393))
  *  install ewea-event on dev ([4a8136b0](https://github.com/codetanzania/ewea-common/commit/4a8136b0d70b49ef44892c891efa2875b0382448))
  *  force latest version & audit fix ([aa25b67a](https://github.com/codetanzania/ewea-common/commit/aa25b67aead1ceb41bc9784f4b229fc831e60947))
* **fixtures:**  add events csv file ([07a508e1](https://github.com/codetanzania/ewea-common/commit/07a508e1f358ad581e87f493d0ce7ba665e31fae))

##### New Features

* **seed:**
  *  implement agencies & focals seeding ([98737e28](https://github.com/codetanzania/ewea-common/commit/98737e281bd9ed13aaac9f0d6b9be472f2bcf47f))
  *  support json data files ([1c080c82](https://github.com/codetanzania/ewea-common/commit/1c080c82922057d8642e6ff2813993aab4b12f23))
  *  order predefine seeding order ([1ed5a3c6](https://github.com/codetanzania/ewea-common/commit/1ed5a3c681cd91ae8bb5de9429806375422497c7))
  *  support filePath & extra properties on csv seed ([4ad7fc42](https://github.com/codetanzania/ewea-common/commit/4ad7fc4219b9f6193c7ba4aa2a6ef6a317e0aa8c))
  *  add seedFromJson for any data model ([f7a6d12f](https://github.com/codetanzania/ewea-common/commit/f7a6d12f12e83b9d80ddd09d6762a680437f4081))
  *  add seedFromCsv for any model form csv ([5c7f011d](https://github.com/codetanzania/ewea-common/commit/5c7f011df7fb766b928dcaeeddfdbd2900002e2e))
* **seeds:**  support seeding of seeds ([290cda5e](https://github.com/codetanzania/ewea-common/commit/290cda5ec8b27f44f98cc40f2a54be72688880bf))

##### Other Changes

* CodeTanzania/ewea-common into feature/improve-test-coverage ([d02a5163](https://github.com/codetanzania/ewea-common/commit/d02a51638070deb687a6a18070b9bec026c8beb5))

##### Refactors

* **seed:**
  *  improve event seed ([1589b47b](https://github.com/codetanzania/ewea-common/commit/1589b47b20b05bb8967bcd759adf377013f3a950))
  *  implement event seed ([cf2b31b6](https://github.com/codetanzania/ewea-common/commit/cf2b31b67f58ccea2f39db4b3bde7893c0765f36))
  *  improve predefine seed flow ([a951e229](https://github.com/codetanzania/ewea-common/commit/a951e22918b4200e623108b90c5b0a2492d194c7))
  *  name permission seed tasks ([23a12dd9](https://github.com/codetanzania/ewea-common/commit/23a12dd9ab84efcfc4839ed9c0369cfef2179889))
*  improve assertion on unit tests ([4d1b15d1](https://github.com/codetanzania/ewea-common/commit/4d1b15d149413045eaed44b8540c0cd59b1069b2))
*  process csv function ([bd6eaf39](https://github.com/codetanzania/ewea-common/commit/bd6eaf3987781506cfc3d5bb042dfac78599e5a2))
*  order seed helpers & test scripts ([0b3ef8c2](https://github.com/codetanzania/ewea-common/commit/0b3ef8c2263c0cb836a78cd222cad6c4776cb99d))

##### Tests

* **seed:**  improve test coverage ([89eec776](https://github.com/codetanzania/ewea-common/commit/89eec776b822075089d4b4ca7627fd582cb80134))
* **fixtures:**  add events json file ([32b8fb74](https://github.com/codetanzania/ewea-common/commit/32b8fb744c8e80539e3883caa37fe7d6529cd3e9))
*  add unit test for process csv function ([0c5037f5](https://github.com/codetanzania/ewea-common/commit/0c5037f5d5c115d393b9fcaee8cfbc76cdadbc19))
* **env:**  ensure same locales ([10754730](https://github.com/codetanzania/ewea-common/commit/10754730b20c0c50271c9e4e41a5c1e088dc56c6))

#### 0.5.1 (2020-01-20)

##### New Features

* **seed:**  add event statuses & urgencies ([f3b1273f](https://github.com/codetanzania/ewea-common/commit/f3b1273f182609940a15acf7057a3cc59b599263))

#### 0.5.0 (2020-01-20)

##### Refactors

* **internals:**  re-export for early import ([48bbff6c](https://github.com/codetanzania/ewea-common/commit/48bbff6c4e49b723cdebec35f1eec618b7094759))

#### 0.4.1 (2020-01-20)

##### Chores

* **deps:**
  *  force latest version & audit fix ([d84e261f](https://github.com/codetanzania/ewea-common/commit/d84e261fa62ee509211d5e22f6fb2e212ffa40de))
  *  force latest version & audit fix ([baa820f3](https://github.com/codetanzania/ewea-common/commit/baa820f36a4d2a2d2263834838457cd0a9c4ecbc))
* **todos:**
  *  add to be implemented placeholders ([d18d6038](https://github.com/codetanzania/ewea-common/commit/d18d6038d4845c7072bbf83f39aea9b998132b1c))
  *  add to be implemented placeholders ([0b3a126a](https://github.com/codetanzania/ewea-common/commit/0b3a126ada696258c36de479b477bc2ee4d4dd2f))
* **fixtures:**  rename to samples to avoid collisions ([945950cf](https://github.com/codetanzania/ewea-common/commit/945950cfa27914390649ccc540b8eb4cb5d20d59))

##### New Features

* **seed:**
  *  add runtime permissions seed ([7b170999](https://github.com/codetanzania/ewea-common/commit/7b170999b8df0c874dd17b868ead30c25dd8a8c7))
  *  seed event catalogues from csv ([dbc49e9e](https://github.com/codetanzania/ewea-common/commit/dbc49e9e2b21cf3e3f5fcac0198d679516028909))
  *  seed features from csv ([c98259a0](https://github.com/codetanzania/ewea-common/commit/c98259a0db1fad585fd90ef97396f45d1e12704e))
  *  seed administrative areas from csv ([f613d460](https://github.com/codetanzania/ewea-common/commit/f613d460ec8ac329ec9b1569ee12cadfcc9e574d))
  *  seed notification templates from csv ([e635584d](https://github.com/codetanzania/ewea-common/commit/e635584df2a6075fdbc6c718efd8c36ba46fd38f))

##### Other Changes

* **seed:**  seed administrative areas from csv ([8564b7b7](https://github.com/codetanzania/ewea-common/commit/8564b7b76970fcc3f0b97ebaa8611ad8e6645f02))

#### 0.4.0 (2020-01-14)

##### Chores

* **deps:**
  *  force latest version & audit fix ([54521070](https://github.com/codetanzania/ewea-common/commit/5452107066a4e49e632c229f2ab282c9235548b5))
  *  force latest version & audit fix ([fca54ffd](https://github.com/codetanzania/ewea-common/commit/fca54ffdcc1a939d37099be5c496dcd553134f97))

##### Refactors

*  use ewea internals ([8cf0704f](https://github.com/codetanzania/ewea-common/commit/8cf0704f61f7d4ed2aec8614442ab52d92602dce))

#### 0.3.0 (2019-12-17)

##### Chores

*  prepare release v0.3.0 ([2d6aadff](https://github.com/codetanzania/ewea-common/commit/2d6aadff83a331f1439e3c55177a599e66d6bfb1))

##### Documentation Changes

*  drop WIP ([d8fdacd5](https://github.com/codetanzania/ewea-common/commit/d8fdacd518e995e7061894e454c103a40e2dd1a1))

##### New Features

* **seed:**
  *  seed event questions from csv ([bb2c3d3b](https://github.com/codetanzania/ewea-common/commit/bb2c3d3b9ef96d83d506b0ca4e839120d3d2fd47))
  *  seed event indicators from csv ([d2feb5d9](https://github.com/codetanzania/ewea-common/commit/d2feb5d961928bd1b3222d50bd045ba3d0db12e4))
  *  seed feature types from csv ([b8b6025b](https://github.com/codetanzania/ewea-common/commit/b8b6025b0c1a19b5932da8e374afacf30d20f4ae))
  *  seed administrative levels from csv ([f59adcfd](https://github.com/codetanzania/ewea-common/commit/f59adcfd2646d852759d34091fa9b7d201f1f118))
  *  seed unit from csv ([851aa6e2](https://github.com/codetanzania/ewea-common/commit/851aa6e22bf265cdf5eeb3c735e937a11dfa394c))
  *  seed event actions from csv ([073716af](https://github.com/codetanzania/ewea-common/commit/073716af498ed73d2f5a0fd41b38e9344459bc7e))
  *  seed event functions from csv ([427932a6](https://github.com/codetanzania/ewea-common/commit/427932a683707dcb0bead57de23c09055fc5ef94))
  *  seed event types from csv ([17f9f779](https://github.com/codetanzania/ewea-common/commit/17f9f779ed2242e58f38e6473d7fa90cd7ef7769))
  *  seed event groups from csv ([279116e6](https://github.com/codetanzania/ewea-common/commit/279116e66e67d64cae0591870060f2c0e802a1be))
  *  seed party roles from csv ([6ddab0df](https://github.com/codetanzania/ewea-common/commit/6ddab0df5d2912d39811ab83b8e386a172cd8293))
  *  seed party groups from csv ([8297eed5](https://github.com/codetanzania/ewea-common/commit/8297eed5d5f985139943d41fcfe0621e7b382aa0))
  *  seed event certainty from csv ([46aec348](https://github.com/codetanzania/ewea-common/commit/46aec34871192df37eee4db0b1ddcfe7d28d134a))
  *  implement base seed helpers ([8653dee5](https://github.com/codetanzania/ewea-common/commit/8653dee5e2629ece1947cb5256b7856466ab6004))
  *  implement predefine seed transformer ([9d3e587e](https://github.com/codetanzania/ewea-common/commit/9d3e587e7726d4d9d49743219709e093075306db))
  *  add to predefine transform ([759a4a52](https://github.com/codetanzania/ewea-common/commit/759a4a5274fe952b0a97fad0bc3e55c10cc2c719))
  *  implement inital seed helper ([7489e554](https://github.com/codetanzania/ewea-common/commit/7489e554ec801cb684142cda8b7fd0cc7529dc91))
  *  add transform runner ([4fcf6f2d](https://github.com/codetanzania/ewea-common/commit/4fcf6f2d368cd857e2b7d4cdda06fa0e9f62e993))
  *  add key transformer ([6d8720f2](https://github.com/codetanzania/ewea-common/commit/6d8720f247acf8350a0704f9964373a29cf23246))
  *  compute json seed path of given model name ([6af30db4](https://github.com/codetanzania/ewea-common/commit/6af30db4ac87f64aa9fec50031516a69cebdc8e6))
  *  compute geojson seed path for given model name ([faeadb85](https://github.com/codetanzania/ewea-common/commit/faeadb8574656322354dc2545238d5625e2e14fc))
  *  compute shapefile path for given model name ([2125ee7e](https://github.com/codetanzania/ewea-common/commit/2125ee7ea0dc54c0ef715840c3690ebb518abd50))
  *  compute csv path for model name ([e49e3df8](https://github.com/codetanzania/ewea-common/commit/e49e3df86b0488bd66e0e7f329c3f963f388452b))
  *  add path derive helpers ([f7045a2d](https://github.com/codetanzania/ewea-common/commit/f7045a2d73cdf82b205fdecc6ff39045b8c2a8ae))
* **data:**  add action predefine relation ([140898da](https://github.com/codetanzania/ewea-common/commit/140898daa7fad32ad1d50c8117f0c76526b0c3cb))

##### Code Style Changes

* **seed:**
  *  add seed runner jsdoc ([86c5fa9c](https://github.com/codetanzania/ewea-common/commit/86c5fa9cb7f4c71895c3d7ebfbe4c9c3243ec5ef))
  *  add missing jsdocs ([a15eb16b](https://github.com/codetanzania/ewea-common/commit/a15eb16b8a25a5dfe2c815fa3b2ab12ef0b77cc5))

##### Tests

* **fixtures:**
  *  add sample csv ([09c30c42](https://github.com/codetanzania/ewea-common/commit/09c30c42ac84e8456d691114ec789ae90484a02c))
  *  rename to features ([a271b05a](https://github.com/codetanzania/ewea-common/commit/a271b05a8ebed693971977c8faa3cf686bbb5502))
*  add sample json fixture ([c795110c](https://github.com/codetanzania/ewea-common/commit/c795110c14af9b41067ba86678e7f478bd368a58))
*  add fixtures ([5e2f3fb1](https://github.com/codetanzania/ewea-common/commit/5e2f3fb158632a58ff26ab7797d745cb5fcb7d14))

#### 0.2.1 (2019-12-16)

##### Chores

* **deps:**  force latest version & audit fix ([09ef43c9](https://github.com/codetanzania/ewea-common/commit/09ef43c9f7a5821a5e21aef1ef05141265c93b56))

#### 0.1.0 (2019-12-10)

##### New Features

* **database:**  add connect & syncIndexes shortcuts ([c5ad0754](https://github.com/codetanzania/ewea-common/commit/c5ad07547a862677d53a501ff712055ebaa25c87))
*  add common predefine relations ([d8ca220b](https://github.com/codetanzania/ewea-common/commit/d8ca220bd415bcbc474b2156090a5b2db88385a5))
*  add predefine relations ([31619ba3](https://github.com/codetanzania/ewea-common/commit/31619ba341566c96be2cebceb10295897c9b34c5))
* **internals:**  ensure predefine namespaces ([029705eb](https://github.com/codetanzania/ewea-common/commit/029705eb2220822b66c6599c09d93640dfd02864))


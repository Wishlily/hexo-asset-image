# hexo-asset-image


Give asset image in hexo a absolutely path automatically

# Usege

```shell
npm install https://github.com/Wishlily/hexo-asset-image.git --save
```

# Example

```shell
MacGesture2-Publish
├── apppicker.jpg
├── logo.jpg
└── rules.jpg
MacGesture2-Publish.md
```

Make sure `post_asset_folder: true` in your `_config.yml`.

Just use `![logo](logo.jpg)` to insert `logo.jpg`.

# asset image
```
image:
  mode: url # url,bucket
  url: # sina
    file: image.json
  bucket: # qiniu
    mkdir: false
    url: http://xxx.bkt.clouddn.com
    urlPrefix: images
    folder: images
    extend: ink
```

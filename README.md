### これは何？

Unity で使える .NET framework の機能には制限があります。この制限を確認するためのページとして "[Mono Compatibility](http://unity3d.com/support/documentation/ScriptReference/MonoCompatibility.html)" がありますが、非常に重く閲覧性が悪いため、まあぶっちゃけ不評です。

このツールは、Unity editor 内の機能として .NET 互換性の確認手段を提供するものです。

![screenshot](https://github.com/downloads/keijiro/unity-compatchecker/screenshot.png)

"Class name" のボックスにクラス名の一部分を入力すると、それにマッチするクラスを検索し、そこに実装されているメソッドが一覧で表示されます。 "Match exactly" のボックスにチェックを入れると完全に一致するクラスのみを表示します。

### 注意

メソッドにカスタム属性が与えられている場合は、それが末尾に表示されます。特に注意すべきは SecurityCriticalAttribute です。Web Player においては、この属性の付けられたメソッドは使用不可となります。

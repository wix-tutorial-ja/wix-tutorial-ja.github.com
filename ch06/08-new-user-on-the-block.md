---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 8. 新顔のユーザー
current: ch06-08
prev: 07-add-or-remove-programs-entries
prev-title: 7. プログラムの追加と削除の項目
next: 09-environmentally-friendly
next-title: 9. 環境に優しく
origin: /com-expression-syntax-miscellanea/new-user-on-the-block/
---
#  Lesson 6 COM、式の構文、その他

## 8. 新顔のユーザー

WiX ツールセットの追加のライブラリには、新しいユーザー・アカウントを追加する、
というような追加の仕事をインストーラが出来るようにするものもあります。

{% highlight xml %}
<Component>
  <user:User Id='NewUser' Name='username' Password='password' />
</Component>
{% endhighlight %}

インストーラ・パッケージをリンクするときに、適切な WiX 拡張モジュールをリンクしなければなりません。

{% highlight bat %}
light.exe -ext WixUtilExtension -out Sample.msi Sample.wixobj
{% endhighlight %}

このライブラリは、フォルダの共有を作成する手段も提供しています。
次のコードの断片を **Component** の中に置くだけで、そのコンポーネントがインストールされるフォルダに共有を設定することが出来ます。

{% highlight xml %}
<user:User Id='Everyone' Name='Everyone' CreateUser='no'
    FailIfExists='no' RemoveOnUninstall='no' />
<user:FileShare Id='MainExecutableShare'
    Description='ほげ 1.0 の共有フォルダ'
    Name='ほげ共有フォルダ'>
  <user:Permission GenericRead='yes' ReadPermission='yes'
      Read='yes' GenericExecute='yes'
      User='Everyone' />
</user:FileShare>
{% endhighlight %}

**FileShare** の属性は自ずから明らかでしょう。
共有に伴うアクセス許可を指定するためには **Permission** 要素を使う必要がありますが、
そのためには **User** が指定されていなければなりません。
ここでは、新しいユーザーを作ることは求めていませんし (**CreateUser** を見て下さい)、
製品を削除する時にユーザーを削除することも求めていません (**RemoveOnUninstall** を見て下さい)。
実際のアクセス許可としては、
*Delete*, *Execute*, *Read*, *Write*, *GenericExecute*, *GenericRead*, *GenericWrite*, *TakeOwnership*, *ReadAttributes*, *WriteAttributes*
などの属性の中から選ぶことが出来ます。
使用可能な全ての属性を知るためには、ヘルプ・ファイルを参照して下さい。

**CreateFolder** 要素の中でも **Permission** タグを使うことが出来ることに注意して下さい。
いくつかの追加の属性(*CreateChild*, *CreateFile*, *DeleteChild*, *Traverse*) は、その場合のために予約されているものです。

> 訳註：上記の例をソース・ファイルに記述するためには、最初に、Wix の開始タグの中で、
> WixUtilExtension 拡張モジュールに言及する必要があります。
>
>     <Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'
>          xmlns:user='http://schemas.microsoft.com/wix/UtilExtension'>
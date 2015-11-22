---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 1 - 始めよう / 8. 削除時の孤児化
current: ch01-08
prev: 07-beyond-files
prev-title: 7. ファイルだけでなく
next: /ch02/index
next-title: Lesson 2 ユーザー・インタフェイス
origin: /getting-started/orphaned-on-removal/
---
# Lesson 1 始めよう

## 8. 削除時の孤児化

アプリケーションは、稼働中に、元のインストーラ・パッケージに入っていなかったファイルを作成することがあります
(ユーザーのデータ・ファイル、ユーザーの設定、ログ・ファイル、その他)。
製品をアンインストールするときに、それらのファイルを削除する必要がある場合もあります。
個々のファイルを削除するためには、**RemoveFile** を使用します。

    <Component>
      ...
      <RemoveFile Id='LogFile' On='uninstall' Name='Hoge10User.log' />
    </Component>

**On** 属性によって、ファイルをいつ削除するかを決定します(指定できる値は、*install*, *uninstall* そして *both* です)。
**Name** には、ワイルドカード文字を含ませることが出来ます。
ファイルは、コンポーネントそのものと同一のフォルダに位置していなければなりません。
このフォルダをオーバーライドするためには、**Directory** 属性あるいは **Property** 属性を使うことが出来ます。
後者を使えば、インストーラ・パッケージを作成するときにはまだパスが分らないフォルダからでも、ファイルを削除することが可能になります。

アンインストール時にフォルダを削除するように指示する方法については、すでに調べました。
しかし、インストーラでなくアプリケーションによって作成されるフォルダに関しては、それらを個別に指定する必要があります。

    <Component>
      ...
      <RemoveFolder Id='LogFolder' On='uninstall' />
    </Component>

ここでも、フォルダがコンポーネント自体のフォルダではない場合には、**Directory** または **Property** を使うことが出来ます。
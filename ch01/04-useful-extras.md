---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 1 始めよう / 4. 便利な追加機能
current: ch01-04
prev: 03-putting-it-to-use
prev-title: 3. 使用に供する
next: 05-where-to-install
next-title: 5. どこにインストールするか?
origin: /getting-started/useful-extras/
---
# Lesson 1 始めよう

## 4. 便利な追加機能

言うまでもない事ですが、単に二～三のファイルをコピーするよりも、はるかに多くのことが出来ます。
まず最初に、起動条件を付けることが出来ます。
何らかのグローバルな設定をチェックして、もし条件が合わなければ、インストールを中止することが出来るのです。
前のサンプルのどこか、機能(Feature)の中ではないところ(例えば、*Package* タグと *Media* タグの間)に、下記の行を追加して下さい。
そうすると、あなたがマシンの管理者でない場合は、パッケージは起動しなくなります。

    <Condition Message="インストールするためには、管理者である必要があります。">
      Privileged
    </Condition>

Vista の場合は、こうです。

    <Condition Message="インストールするためには、管理者である必要があります。">
      AdminUser
    </Condition>

注意すべき事は、開始タグと終了タグの間に書かれた条件が**偽**と評価されるときに、メッセージが表示されて、インストールが中止されるということです。
言い換えると、エラーになる条件を定義するな、インストールを続行したい条件を定義しろ、ということです。

    <Condition Message="インストールするためには、管理者ではない必要があります。">
      NOT Privileged
    </Condition>

同様の条件として使える標準的なプロパティはかなり沢山ありますが、
最も重要なものはセットアップを起動しようとしている Windows のバージョンを特定するものでしょう。
*Version9X* は、Windows 95, 98 および ME の場合に真になります。
*VersionNT* は、NT 4.0 以降で真になります。*VersionNT64* は、64-bit オペレーティング・システムを示します。

    <Condition Message='この製品は、Windows 95/98/ME でのみ動作します。'>
      Version9X
    </Condition>

実際には、これらのプロパティは真偽値ではなく整数値であり、さらに詳細な変種をチェックするために使うことも可能です。

    <Condition Message='Windows 95'>
      Version9X = 400
    </Condition>
    <Condition Message='Windows 95 OSR2.5'>
      Version9X = 400 AND WindowsBuild = 1111
    </Condition>
    <Condition Message='Windows 98'>
      Version9X = 410
    </Condition>
    <Condition Message='Windows 98 SE'>
      Version9X = 410 AND WindowsBuild = 2222
    </Condition>
    <Condition Message='Windows ME'>
      Version9X = 490
    </Condition>
    <Condition Message='Windows NT4'>
      VersionNT = 400
    </Condition>
    <Condition Message='Windows NT4 SPn'>
      VersionNT = 400 AND ServicePackLevel = n
    </Condition>
    <Condition Message='Windows 2000'>
      VersionNT = 500
    </Condition>
    <Condition Message='Windows 2000 SPn'>
      VersionNT = 500 AND ServicePackLevel = n
    </Condition>
    <Condition Message='Windows XP'>
      VersionNT = 501
    </Condition>
    <Condition Message='Windows XP SPn'>
      VersionNT = 501 AND ServicePackLevel = n
    </Condition>
    <Condition Message='Windows XP Home SPn'>
      VersionNT = 501 AND MsiNTSuitePersonal AND ServicePackLevel = n
    </Condition>
    <Condition Message='Windows Server 2003'>
      VersionNT = 502
    </Condition>
    <Condition Message='Windows Vista'>
      VersionNT = 600
    </Condition>
    <Condition Message='Windows Vista SP1'>
      VersionNT = 600 AND ServicePackLevel = 1
    </Condition>
    <Condition Message='Windows Server 2008'>
      VersionNT = 600 AND MsiNTProductType = 3
    </Condition>
    <Condition Message='Windows 7'>
      VersionNT = 601
    </Condition>

[このようなプロパティが他にも沢山あり](https://msdn.microsoft.com/en-us/library/aa370905(VS.85).aspx#operating_system_properties)、起動条件として使用できます。
例えば、**MsiNTProductType** を使うと、ワークステーション、ドメイン・コントローラ、サーバーを区別することが出来ます。
その他の **MsiNT** プロパティも、必ずチェックしておいて下さい。
---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 1 - 始めよう / 1. ソフトウェア・パッケージ
current: ch01-01
prev: index
prev-title: Lesson 1 - 始めよう
next: 02-the-files-inside
next-title: 2. 中に入れるファイル
origin: /getting-started/the-software-package/
---
# Lesson 1 始めよう

## 1. ソフトウェア・パッケージ

最初の WiX サンプルは、非常に簡単な空想上のアプリケーションをインストールするものです。
このアプリケーションは、実行ファイルと DLL ライブラリ、そしてユーザー・マニュアルから構成されています。
この三つのファイルが、アプリケーション固有のフォルダにコピーされるものとします。
また、スタート・メニューの通常の場所に二つのショートカットを出現させることにします。
さらに、ユーザーのデスクトップにもアプリケーションを起動するショートカット・アイコンを追加しましょう。

このインストール・パッケージほど単純なものであっても、基礎となっている Windows Installer は非常に多くの機能を提供してくれます。
たとえば、このプログラムも**「コントロール・パネル > プログラムの追加と削除」**の中に自動的に追加されます。
Windows Installer が私たちのプログラムを確実に追跡して記録しておけるようにするために、私たちは何らかの識別方法を提供しなければなりません。
全てのアプリケーションは人間が読める名前を持っていますが、Windows は私たちのパッケージのあらゆる部分を識別するために、
単なる名前ではなく、もっとユニークな識別子である GUIDを必要とします。
GUID とは、CE26AD1E-00D5-4E03-8CBE-6DA5C23AA833 のような、あの長ったらしい16進の数値です。
GUID は無料で、いつでも、欲しいだけ生成することが出来ます。
生成された GUID は一意であることが保証されていて、他の誰かが別のコンピュータで GUID を取得しても、あなたが取得する GUID と衝突することは決してありません。
GUID を取得するユーティリティーは数多くあります。
例えば、この単純な [C プログラム](https://www.firegiant.com/system/files/samples/uuidgen.c) は、どんな C/C++ コンパイラでもコンパイルすることが出来ます。
別のプログラミング言語を使う場合でも、必要な Win32 関数 **(CoCreateGuid と StringFromCLSID)** を呼び出すようにすれば、GUID を生成出来ます。

もう一つの方法として、多くのプログラマ用エディタや統合開発環境では、
要求に応じて新しく生成した GUID をソース・コードに挿入する機能を提供していますので、それを利用することも出来ます。
使用するツールが小文字の16進数文字を生成する場合は、WiX に渡す前に大文字に変換して下さい。

*このチュートリアルの GUID は、ダウンロード出来るサンプルにあるものも含めて、すべて不正なものになっています* —
最初のセクションが全て **YOURGUID** に変更されているのです。
このことは、サンプルはそのままではビルドすることが出来ない、あなた自身が生成した GUID を最初に提供しなければならない、
ということを意味しています
(ビルドを試みると、**"fatal error CNDL0027: The 'Id' attribute has an invalid value according to its data type."** というエラーになります)。
これはちょっとした不便ですが、万が一の危険を避けるためには必要な措置です。
さもなくば、複数の人が、サンプルのどれかをそのまま使用し、GUID を変更するのを忘れて、衝突の危険を作って野に放つかも知れません。
もう一つ注意が必要なのは、GUID の全体を置き換える必要があるということ、すなわち、別の GUID から取った部分を混ぜ合せてはいけないということです
(換言すると、YOURGUID だけを置き換えるな、全部の数値を置き換えろ、ということです)。
GUID は、生成されたままで使用される場合にだけ、一意性が保証されます。

始めに、二つの GUID が必要です。一つは製品(Product)のため、もう一つはインストーラ・パッケージ(Package)のためです。
実務上のプロジェクトでは、**UpgradeCode** の GUID も必ず必要になるので、実際には三つです。 
他の二つは、おそらく後で参照する必要が生じますので、ファイルに保持しておかなければなりませんが、
**Package** の GUIDは、パッケージを生成するたびに違うものである必要があります。
事を簡単にし、新しい GUID を発行するのを忘れないようにするために、アスタリスクをタイプして WiX に GUID を自動生成させることが出来ます — 
ただし、これはパッケージの GUID だけに当てはまることを忘れないで下さい。
その他の全ての GUID は、一意性を保たなければならず、将来にわたって記録されなければなりません。
これらの GUID と製品に関するその他のテキスト情報が `SampleFirst.wxs` の一番最初の部分に来ます。

    <?xml version='1.0' encoding='windows-1252'?>
    <Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
    
      <Product Name='Foobar 1.0'
          Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
          UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
          Language='1033' Codepage='1252'
          Version='1.0.0' Manufacturer='Acme Ltd.'>
    
        <Package Id='*' Keywords='Installer'
            Description="Acme's Foobar 1.0 Installer"
            Comments='Foobar is a registered trademark of Acme Ltd.'
            Manufacturer='Acme Ltd.' InstallerVersion='100'
            Languages='1033' Compressed='yes' SummaryCodepage='1252' />

製品の名前と説明は、当然、あなたの意向によって決ります。
*Version* 属性は、標準的な **major.minor.build** 形式に従って下さい。
Windows Installer は、リビジョン(revision)を区別する別の方法を提供しているため、最後に来る第4のフィールド、**.revision** を無視します。

ご存じのように、XML は形式については非常に自由です。適切だと思われるなら、段落下げや空行を使って下さい。
属性の値はすべて引用符で囲みますが、単一引用符か二重引用符かは自由に選ぶことが出来ます。
この規則を使うと、引用符を含む文字列値を書くことが簡単に出来ます(上記の **Description** を参照して下さい)。
その文字列を囲むのに、もう一方の引用符を使うようにだけ気を付ければ良いのです。

XML を作成するのには、UTF-8 も ANSI も使うことが出来ます。
普通の ANSI 文字または標準 ANSI 文字セットのアクセント記号付き文字だけを使う予定であれば、この例に示されているように **windows-1252** の設定で十分です。
ユーザー・インタフェイスにおいてもっと多数の文字または違う文字セットを使う必要がある場合は、UTF-8 に変更して、
[適切な言語とコードページの数値](https://msdn.microsoft.com/en-us/library/Aa369771.aspx)を使って下さい。
例えば、日本語であれば、次のように変更します。

    <?xml version='1.0' encoding='utf-8'?>
    <Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
    
      <Product Name='ほげ 1.0'
          Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
          UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
          Language='1041' Codepage='932'
          Version='1.0.0' Manufacturer='ぴよソフト'>
    
        <Package Id='*' Keywords='インストーラ'
            Description="ぴよソフト's ほげ 1.0 インストーラ"
            Comments='ほげはぴよソフトの登録商標です。'
            Manufacturer='ぴよソフト' InstallerVersion='100'
            Languages='1041' Compressed='yes' SummaryCodepage='932' />
             
> 訳註：これ以降、原文のソフト名 "Foobar" と会社名 "Acme Ltd." は、慣例に従って、"ほげ(Hoge)" および "ぴよ(Piyo)ソフト" と訳出します。
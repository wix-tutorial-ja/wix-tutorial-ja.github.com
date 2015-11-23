---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 2 ユーザー・インタフェイス / 1. 最初のステップ
current: ch02-01
prev: index
prev-title: Lesson 2 ユーザー・インタフェイス
next: 02-custom-settings
next-title: 2. カスタムの設定
origin: /user-interface/first-steps/
---
# Lesson 2 ユーザー・インタフェイス

## 1. 最初のステップ

前のサンプルを素敵なユーザー・インタフェイスで拡張しましょう。
しかし、詳細に踏み込む前に、[SampleWixUI](https://www.firegiant.com/system/files/samples/SampleWixUI.zip) をダウンロードし、
コンパイルして走らせて、どんなことが出来るか、だいたいの感じをつかんで下さい。
次のコマンドでビルドして下さい(リンカのコマンドの新しい引数については、後で説明します)。

> 訳註：SampleWixUI の日本語版は [Sample-2-1-WixUI.zip](/samples/Sample-2-1-WixUI.zip) です。

    candle.exe SampleWixUI.wxs
    light.exe -ext WixUIExtension SampleWixUI.wixobj

カスタム・インストールを選んで、インストール先のフォルダを変更してみて下さい。
インストールが完了したら、インストーラ・パッケージをもう一度実行してみて下さい。
すると、今度はプログラムの変更または削除が出来ます(同じことは **「プログラムの追加と削除」** で **\[変更\]** を選んだ時にも出来ます)。

どうやってこれだけの機能を獲得できたのかを見ていきましょう。
最初の部分は前と同じです — 結局のところ、インストールしようとしているのは同じ製品、同じファイル、同じコンポーネント、同じ機能です。

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
    
          ...
    
          <Directory Id="DesktopFolder" Name="Desktop" />
        </Directory>

ここまでは、目新しいものは何もありません。次に来るセグメントの構造も見慣れたものですが、二～三、新しい属性が追加されています。

        <Feature Id='Complete' Title='ほげ 1.0'
            Description='完全パッケージ。' Display='expand'
            Level='1' ConfigurableDirectory='INSTALLDIR'>
          <Feature Id='MainProgram' Title='プログラム'
              Description='メインの実行ファイル。' Level='1'>
            <ComponentRef Id='MainExecutable' />
            <ComponentRef Id='HelperLibrary' />
            <ComponentRef Id='ProgramMenuDir' />
          </Feature>
    
          <Feature Id='Documentation' Title='説明書'
              Description='取扱説明書。' Level='1000'>
            <ComponentRef Id='Manual' />
          </Feature>
        </Feature>

今回はユーザー・インタフェイスを持っている訳ですから、ユーザーに対して、どういう機能の選択肢があるかを知らせるために、
何かを表示しなくてはなりません。そのために、人間が読むことが出来る何らかの記述が必要になります。
コンパイルされたインストーラ・パッケージをもう一度開始してカスタム・セットアップまで進めば、
各種の UI テキストがどこにどんな形で現れるかを見ることが出来ます。

**Title** 属性の内容が、ダイアログの左側のツリービューの項目に使われています。
そして、ツリーの中の項目をクリックすると、右側の四角形の中に **Description** のテキストが現れます。
**Display** 属性(選択可能な値は *collapse*, *expand* および *hidden* です)は、
指定されたツリーの部分が初期状態では折り畳まれて表示される(collapse)か、
展開されて表示される(expand)か、それとも全く表示されない(hidden)かを決定します。

**Level** 属性を使うと、どの機能がインストールされるかを決めることが可能になります。
普通のシナリオでは、ユーザーに、*Typical*, *Complete* および *Custom* という三つの選択肢を提供します。
後の二つは単純です(*Complete* は全てをインストールし、*Custom* はユーザーが全てを細部まで指定できるようにします)が、
*Typical* については、どの機能がそれに属するかを私たちが決めなければなりません。
あるいは、必要なら、選択肢の数を増やすことも可能です。
インストーラは、実行時に、1 以上 32,767 以下の任意の値を取る **INSTALLLEVEL** という作成済みのプロパティを使用します。
そして各機能は、そのレベルが 0 ではなく、かつ、**INSTALLLEVEL** の現在の値を越えない場合にインストールされます。

私たちのユーザー・インタフェイスでは、この **INSTALLLEVEL** を Typical が選ばれると 3 に設定し、
Complete が選ばれると 1,000 に設定します(この第二の数値はかなり恣意的なものです。使用可能な数値なら何でも良かったのです)。
このため、Typical に含めたくない機能は、このレベルでマークしなければなりません。
Typical(標準)インストールの場合は **INSTALLLEVEL** が 3 になりますので、1 以上 3 以下のレベルを持つ機能だけがインストールされ、
それを越えるレベルのものは — **Level=1000** の機能も含めて — 放っておかれます。

そして最後に、一番重要な部分が、**ConfigurableDirectory** です。
この属性の値として **INSTALLDIR** を参照していますが、これは、数行前の一番内側の **Directory** タグで、
インストール先として指定したディレクトリです。
こうすることによって、私たちが元来意図していたインストール先をユーザーが変更出来るようにしている訳です。
この属性を使用しないようにすれば、ユーザーは前と同じようにいろいろな機能を有効にしたり無効にしたりする事は出来ますが、
インストール先ディレクトリは変更することが出来なくなります。
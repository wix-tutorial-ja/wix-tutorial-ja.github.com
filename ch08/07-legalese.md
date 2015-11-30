---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 7. 法律用語
chapter: ch08
current: ch08-07
prev: 06-well-done
prev-title: 6. よく出来ました
next: 08-out-of-order
next-title: 8. 順番外
origin: /user-interface-revisited/legalese/
---
# Lesson 8 ユーザー・インタフェイス再び

## 7. 法律用語

いくつか細かい所が残っています。例えば使用許諾契約書のページです。

![LicenseAgreementDlg](/images/customlicense.png)

{% highlight xml %}
    <UI>
      ...
      <Dialog Id="LicenseAgreementDlg" Width="370" Height="270"
          Title="[ProductName] 使用許諾契約書" NoMinimize="yes">
{% endhighlight %}

ラジオ・ボタン・グループについては、ソースの後の方で独立した記述をします。
リンクは **Property** 属性によって確立されます。

{% highlight xml %}
        <Control Id="Buttons" Type="RadioButtonGroup"
            X="20" Y="187" Width="330" Height="40"
            Property="IAgree" />

        <Control Id="Back" Type="PushButton"
            X="180" Y="243" Width="56" Height="17"
            Text="[ButtonText_Back]">
          <Publish Event="NewDialog" Value="WelcomeDlg">1</Publish>
        </Control>

        <Control Id="Next" Type="PushButton"
            X="236" Y="243" Width="56" Height="17" Default="yes"
            Text="[ButtonText_Next]">
{% endhighlight %}

今回、次に表示するダイアログの選び方は、ほんの少し手が込んでいます。
インストールによっては、ユーザー名、会社名、および、登録キーの入力をユーザーに求めたくないことがあります。
それに応じて UI を修正する (ページの進行の中で単純にそのページを呼ばないようにする) ことも可能ですが、
ここではもっとエレガントな解法を用います。
**ShowUserRegistrationDlg** というプロパティをどこかで定義しておきます。
このプロパティを `1` に設定すれば、ユーザー登録ページが表示されます。
`0` に設定すれば、ユーザー登録ページはスキップされます。
このことは、それぞれの場合に対応する二つの **NewDialog** イベントを用意することを意味します。

{% highlight xml %}
          <Publish Event="NewDialog" Value="UserRegistrationDlg">
            <![CDATA[IAgree = "Yes" AND ShowUserRegistrationDlg = 1]]>
          </Publish>

          <Publish Event="NewDialog" Value="SetupTypeDlg">
            <![CDATA[IAgree = "Yes" AND ShowUserRegistrationDlg <> 1]]>
          </Publish>
{% endhighlight %}

**SpawnDialog** イベントと **SpawnWaitDialog** イベントは前のページを置き換えずに、新しい子ダイアログ・ボックスを開始します。
前者はユーザーのアクションによって終了されるのを待ちますが、後者は条件式が偽である間だけ表示されます。
私たちの場合では、インストーラが必要なディスク容量を計算している間だけ表示される「お待ち下さい」ダイアログが後者の例です。
サンプルのような小さなインストーラ・パッケージでは、計算には全く時間がかかりませんので、
このダイアログが動いているのを見る機会はまず有りません。
それでも、念のために、ダイアログを用意しておきましょう。
**CostingComplete** は、必要なディスク容量の計算が完了した時に `1` に設定される定義済みのプロパティです。

{% highlight xml %}
          <Publish Event="SpawnWaitDialog" 
              Value="WaitForCostingDlg">
            CostingComplete = 1
          </Publish>
{% endhighlight %}

そして、最後に、おなじみの嫌がらせです。
「次へ」ボタンはユーザーが使用許諾契約への同意を示すまでは無効化された状態に留まります。
私たちは既に **Condition** タグを上位のレベルで使ったり (インストールのプロセス全体を走らせるべきかどうかを決める起動条件)、
**Feature** タグの中で使ったりしました (さまざまな機能のインストールを条件によって無効化する)。
ここで第三の使い方、**Control** タグの中での使い方を説明します。
**Action** 属性を使うと、**Condition** タグの内側の条件が真と評価される場合に、コントロールを *disable*, *enable*, *hide*
または *show* する (あるいは *default* の状態に戻す) ことが出来ます。

{% highlight xml %}
          <Condition Action="disable">
            <![CDATA[IAgree <> "Yes"]]>
          </Condition>

          <Condition Action="enable">
            IAgree = "Yes"
          </Condition>
        </Control>
{% endhighlight %}

小さな事ですが、注意深い読者は気付いているでしょう。
条件式のいくつかに対して、私たちは格好悪い `<![CDATA[...]]>` ラッパーを使いました。
コンパイラのパーサーが XML タグの間に出現する **<** や **>** のような特殊な文字によって混乱することが無いようにするためです。
最も安全な方法は条件式を全てラップすることでしょう (WiX のデコンパイラ、Dark はまさしくそうします)。
けれども — 少なくとも私の考えでは — それではソースがあまりにも読みにくくなります。
それが嫌なら、本当に必要な所だけにラッパーを使うために、どの式が曖昧でどの式がそうでないかについて自分で配慮しなければなりません
(何か理解できない所があれば、コンパイラがエラー・メッセージを出してくれます)。
どちらを選ぶかは、あなた次第です ...

次の部分は既によく知っているところです。

{% highlight xml %}
        <Control Id="Cancel" Type="PushButton"
            X="304" Y="243" Width="56" Height="17" Cancel="yes"
            Text="[ButtonText_Cancel]">
          <Publish Event="SpawnDialog" Value="CancelDlg">1</Publish>
        </Control>

        <Control Id="BannerBitmap" Type="Bitmap"
            X="0" Y="0" Width="370" Height="44" TabSkip="no"
            Text="[BannerBitmap]" />
{% endhighlight %}

次に使用許諾契約書のテキストが来ます。
スクロール可能なコンテンツを持った凹んだテキストのコントロールを開きます。
実際のテキストは内部の **Text** タグに入ります。
ここでは RTF 形式のテキスト・ファイルを指定することが出来ます。
ですから、使用許諾契約書をワード・プロセッサで書いて RTF としてエクスポートするというのが、最も良い考えです
(この目的のためには、ワードパッドがおそらく最善のワード・プロセッサです。
高機能なものを使うと、RTF ファイルがひどく冗長なものになります。
高機能なワード・プロセッサを使うとしても、最終版をワードパッドで保存し直すことを考慮して下さい)。

{% highlight xml %}
        <Control Id="AgreementText" Type="ScrollableText"
              X="20" Y="60" Width="330" Height="120" 
              Sunken="yes" TabSkip="no">
          <Text SourceFile="Binary\License.rtf" />
        </Control>
{% endhighlight %}

契約書のテキストは、ソース・ファイルのこの箇所に直接に書き込むことも出来ます。
しかし、既に述べた方法の方が、はるかに保守が容易であると思われます。

{% highlight xml %}
          <Text>{\rtf1\ansi\ansicpg1252\deff0\deftab720
            {\fonttbl{\f0\froman\fprq2 Times New Roman;}}
            {\colortbl\red0\green0\blue0;}
            \deflang1033\horzdoc{\*\fchars }{\*\lchars }
            \pard\plain\f0\fs20
            This End User License Agreement is a legal agreement
            between you(either an individual or a single entity)
            and ...\par}
{% endhighlight %}

残されている部分は本当に簡単で、詳細な説明には値しません。
あっちやこっちに、タイトル行と水平線を付けて、ダイアログの残りの部分を作ります。

{% highlight xml %}
        <Control Id="Description" Type="Text"
            X="25" Y="23" Width="280" Height="15" Transparent="yes" 
            NoPrefix="yes">
          <Text>以下の使用許諾契約書を注意深く読んで下さい</Text>
        </Control>
        <Control Id="BottomLine" Type="Line"
            X="0" Y="234" Width="370" Height="0" />
        <Control Id="Title" Type="Text"
            X="15" Y="6" Width="200" Height="15" Transparent="yes" 
            NoPrefix="yes">
          <Text>{\DlgTitleFont}エンド・ユーザー使用許諾契約書</Text>
        </Control>
        <Control Id="BannerLine" Type="Line"
            X="0" Y="44" Width="374" Height="0" />
      </Dialog>
{% endhighlight %}

返済すべき借りがまだ有ります。
ダイアログの最初のコントロールで、ラジオ・ボタン・グループの記述に言及しましたが、それが保留されたまま残っています。
ですので、以下にそれを示します。
**Text** 属性の中のプロパティ置換に注目して下さい。
このようにすると、テキストのフォント、サイズ、および色を指定する事が出来ます。

{% highlight xml %}
      <RadioButtonGroup Property="IAgree">
        <RadioButton
            Text="{\DlgFont8}使用許諾契約書の条項に同意します(&A)"
            Value="Yes" X="5" Y="0" Width="250" Height="15" />
        <RadioButton
            Text="{\DlgFont8}使用許諾契約書の条項に同意しません(&D)"
            Value="No" X="5" Y="20" Width="250" Height="15" />
      </RadioButtonGroup>
{% endhighlight %}

しかしこれらのフォントの定義はどこにあるのか、と質問されますか？ 
オーケー、次に示します。
これは、さまざまなテキスト・スタイルを集中管理的に定義する方法で、
ユーザー・インタフェイスのどこからでもこれらのテキスト・スタイルを簡単に参照できます。
色については、*Red*, *Green* および *Blue* の属性を使うことが出来ます (それぞれ 0 から 255 の間の値を指定します)。
追加の装飾として、*Bold*, *Italic*, *Underline* および *Strike* を指定する事が出来ます。

{% highlight xml %}
      <TextStyle Id="DlgFont8" FaceName="Tahoma" 
          Size="8" />
      <TextStyle Id="DlgTitleFont" FaceName="Tahoma" 
          Size="8" Bold="yes" />
      <TextStyle Id="VerdanaBold13" FaceName="Verdana"
          Size="13" Bold="yes" />
{% endhighlight %}

ソース・ファイルの最後には、プロパティの定義が来ます — 
基本的には、私たちが使う変数とその初期値です。
プロパティの中には、インタフェイス要素のテキストの略記として使われているものもあります。
地域化するときは、これらも修正する必要があります。
アンパサンドと角括弧の文字に注意して下さい。
値全体を CDATA ラッパーで包むか、または、こういう扱いにくい文字に XML 実体参照を使うかしなければなりません
(**ButtonText_Next** と **ButtonText_Back** を比較して下さい)。

{% highlight xml %}
    <Property Id="ALLUSERS">2</Property>
    <Property Id="ROOTDRIVE"><![CDATA[C:\]]></Property>
    <Property Id="Setup">セットアップ</Property>
    <Property Id="ButtonText_Next">次へ(&amp;N) &gt;</Property>
    <Property Id="ButtonText_Back"><![CDATA[< 戻る(&B)]]></Property>
{% endhighlight %}

インストーラ・パッケージには、製品と一緒にインストールしたくないけれど、ユーザー・インタフェイスには必要になるファイルが付いています。
つまり、ビットマップとアイコンです。これらについて、ソース・ファイルの末尾で記述します。
これまで、ビットマップとアイコンは **Id** 識別子を使って参照してきましたが、ここで実際のファイル名を定義します。
これらのファイルは、独立したキャビネットを要求した場合でも、`.cab` ファイルではなく `.msi` ファイルに格納されます。

{% highlight xml %}
    <Binary Id="Up" SourceFile="Binary\Up.ico" />
    <Binary Id="New" SourceFile="Binary\New.ico" />
    <Binary Id="custicon" SourceFile="Binary\Custom.ico" />
    <Binary Id="repairic" SourceFile="Binary\Repair.ico" />
    <Binary Id="exclamic" SourceFile="Binary\Exclam.ico" />
    <Binary Id="removico" SourceFile="Binary\Remove.ico" />
    <Binary Id="completi" SourceFile="Binary\Complete.ico" />
    <Binary Id="insticon" SourceFile="Binary\Typical.ico" />
    <Binary Id="info" SourceFile="Binary\Info.ico" />
    <Binary Id="bannrbmp" SourceFile="Binary\Banner.bmp" />
    <Binary Id="dlgbmp" SourceFile="Binary\Dialog.bmp" />
    <Icon Id="Hoge10.exe" SourceFile="HogeAppl10.exe" />
  </Product>
</Wix>
{% endhighlight %}

ビットマップやアイコンを変更したいときは、Binary ディレクトリの中だけで変更して下さい。
表紙のビットマップ (ここでは **Dialog.bmp** という名前です) は、503 × 314 ピクセルの BMP ファイルで、
上部のバナー・ビットマップは 500 × 63 ピクセルです。
しかし、ユーザーのシステム・フォントと表示解像度の設定によってインタフェイス全体の拡大縮小が要求される場合には、
Windows Installer がこれらのビットマップを拡大または縮小する可能性があることに注意して下さい。
拡大縮小に伴う醜くて不自然な結果を避けるために、適切なビットマップを使わなければなりません。
均一に見えることを想定した画像を横切る細線のストライプ模様は避けて下さい。
ビットマップにテキストを組み入れてはいけません (ロゴの文字は OK ですが、読んで貰うことを意図した小さなテキストは駄目です)。
そして、何よりも、ディザ処理した領域とチェッカー模様の背景は禁物です。
これらは拡大縮小されるとひどく不自然に見えます。
画像エディタを使って、いろんな倍率で拡大縮小の実験をしてみれば、何を言っているのか分るでしょう。
ただし、バイキュービック・サンプリングなどの洗練されたアルゴリズムは必ず無効にしてください。
Windows は単純な拡大と縮小しか使用しません。

> 訳註：500 × 63 ピクセル、および、503 × 314 ピクセルというビットマップのサイズは、
> WiX 2 時代のライブラリが内蔵していたビットマップのサイズに依拠するものです。
> 現在の WiX 3 のライブラリが内蔵しているビットマップのピクセル・サイズは、それぞれ、493 × 58 ピクセル、493 × 312 ピクセルです。
> 
> ただし、これらのビットマップのサイズは、本文の記述からも分るように、絶対にそうでなければならない、というものではありません。
> それぞれの時代において、その時の標準的な Windows のシステム・フォントと表示解像度のもとでは、
> そのようなピクセル・サイズのビットマップなら拡大縮小されることなく等倍で表示される、ということです。

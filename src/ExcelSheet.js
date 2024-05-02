import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExcelSheet = () => {
  const [data, setData] = useState([
    {
      id: 1,
      serialNumber: "",
      date: "",
      freight: "",
      consignor: "",
      consignee: "",
      gstPaidBy: "",
    },
  ]);

  // Suggestions for each column
  const [initialBiltyNumber, setInitialBiltyNumber] = useState("");
  const [showInitialBiltyPopup, setShowInitialBiltyPopup] = useState(true);

  const consignorSuggestions = [
    "goyal oil delhi.07aeepg9131l1ze",
    "aar chem india 05aapfa2679a1zm",
    "kone polymer 05aatfk5340g1z8",
    "saint polymers bhiwadi  08ACQFS6020G1ZY",
    "klj paraflex bhiwadi  08aahck0117a1z7",
    "mb doors up 09aaffm4352c1zl",
    "mb plywood rudrapur 05aabcm9381j1z6",
    "goyal oil delhi.07aeepg9131l1ze",
    "naini plywood rudrapur 05aaacn6070a2z0",
    "poddar technoplast bhiwari 08afppp1449a1zg",
    " shree bhawani bhiwari 08andp7678b2z1",
    "kgj rubberjaipur 08aaifk2106k1ze",
    "ak trading co.rdr 05amhpp0707g1zc",
    "mayur enginer rdr 05aarfm6889j2zc",
    "shyam enterprises jaipur 08acmps9718h1zw",
    "r.n. polyplast.rudrapur 05agbpa5970g1zr",
    "ceeda organic ,rampur 09aaefc8546k1z0",
    "shree babble ind ,bhiwadi,08abapy8299g1zw",
    "gr corporation,jaipir,08aaofg8925a1za",
    "rudra trading rudrapur 05bhdpa359781zt",
    "paras lubricants delhi 07aaacp0442l1zk",
  ];
  const consigneeSuggestions = [
    "alka traders bijnor 09aykpk4078l1zr",
    "ambika plywood bilaspur up 09aabca5010a1zj",
    "asha plywood bihar 10fzeps9840c1ze",
    "assam timber haridwar 05bahps3614q1z8",
    "amba panel hapur up 09aafca9748k1z1",
    "ankit ply gzb 09abopg9427c1z1",
    "ambika ind kaladera 08abjfa4954d1zg",
    "aroma export pb 03abofa0578l1z8",
    "allide marketing delhi 07aanfa8966c1z6",
    "ananya trading hr 06ajzpg1235h1z4",
    "arora sales kashipur 05bylpa8344r1zu",
    "aar chem india 05aapfa2679a1zm",
    "agarwal plywood pb 03aavfa7109d1zn",
    "aar key doors rohtak 06aaaca1642d1ze",
    "ambey plywood punjab 03aacca9363p1zb",
    "ankit woodcraft lamboria kaladera 08abepa2633g1z6",
    "amit decorativ hr 06aahca1913e1z7",
    "ankit assosiat  kaladera 08aagfa3919c1zs",
    "aradhan plywood  hanuman garch 08abkfa0029l1zg",
    "arun plywood kaladera 08abbfa3907c1zz",
    "b saran pithoragarh 05aagfb2112e1za",
    "bhagwati industries bhilwara 08gzsps7252d1zo",
    "bir manufacturing ludhiana 03efqps3813j1z3",
    "bawa glass kanpur up 09aaacb4820a1zb",
    "bk plywood bareilly up 08aavfb2955j1zv",
    "bs udyog pb 03ajjpk2186m1zz",
    "bkply hanumangarh raj 08aavfb2955j1zv",
    "bagga timber delhi ,07aajcb4280b1zy",
    "bhagwati interprises.karnal 06aatfb5829p1zm",
    "bds decor chandigarh 04aabcb7923k1zp",
    "bharat plywood Punjab 03aaofb4439l1z9",
    "brijwasi ply mathura 09baapa4892b1z2",
    "bhawani udhyog bassi 08adxpa1387n1zv",
    "compect ply hr 06aabcc5912h1zy",
    "concept  bagru 08azmpg1098f1z8",
    "chandwani Co. dehradoon 05aaahc7209p1z8",
    "chandwani timber jwalapur 05abipc9302l1zr",
    "chandwani marbles jwalapur uk 05aachr1032h1zn",
    "capsun engg. yamunanagar hr 06afkpk9021j1zb",
    "chopra plywood pb 03apups7755r1zl",
    "diya channa pb 03edgpk4166j2zg",
    "d.d. plywood hr  06aabcd9517b1zo",
    "dakha celing punjab 03aabcd7882r1z1",
    "dk ind Punjab 03afjpb2446p1zg",
    "devine dpj delhi 07aarfd8298e1zu",
    "devichand gandhi pune 27abjpg4014a1zc",
    "devi chand gandhu pune 27abjpg4014a1zc",
    "devki plywood punjab 03aalfd2127n1zh",
    "diya chahna pb 03edgpk4166j2zg",
    "depak dychem hr 06aabcd6007e1z7",
    "deepak interprises bassi 08amdpj6104d1zj",
    "dk plywood bhiwari 08aaacd6154d1zy",
    "durga plywood bassi 08akfd6898d1zz",
    "eagles d dune 05aavpm3924g1zh",
    "flourishdecor and co meerut up 09awkps1638q1zl",
    "global industries pb 03aaqfg8511q1zv",
    "gm plywood pb 03aanfg9332q2zs",
    "garg plywood pb,03aaffg5702j1zp",
    "gs impex pb 03aatfg8900e1zg",
    "g plywood punjab 03aaofg3424e1zs",
    "garg sales ddune uk 05abmpg2473l1zh",
    "green wood  rohtak 06aaacg2713m1zr",
    "green tarai agro 09aaifg0674l1z1",
    "gayatri ind bassi 08fxdps2380n1zs",
    "gayatri plywood nasik 27ahhpp5390g1z0",
    "goodwill plywood pilibheet up 09abnpv0436d1zj",
    "golden plywood pb 03aaacg5322n1zs",
    "goel fagi 08aaecg9378e1z9",
    "gupta agro punjab 03aadfg7914n1z9",
    "hanuman ply hr 06aacch4490g1zn",
    "hindustan wood dehradoon uk 05escps5961n1z1",
    "hindustan hardwear ajancy d.doo. 05ndzps1985m1z2",
    "homz buildwell delhi 07anvpk4330m2zg",
    "hill timbers d doon 05aabfh4142h1zt",
    "hero food punjab 03aaach9995a1zn",
    "hind ply ind govindgarch 08avppk6177j1zu",
    "indore plywood trader mp 23afwpk2782a1zg",
    "india woodline sampla 06aabci3107n1zo",
    "ishwar infra rengus 08aadci1448q1z4",
    "ishan ind punjab 03aaafi4012j1zz",
    "jmc plywood pb 03aahfj8455b2zk",
    "jai ma durga bihar 10cacpp1519d1zf",
    "jagat enterprises vaeanasi 09aaiph3175p1z5",
    "jaina sons delhi 07aabfj7641k1z6",
    "jai ambay kaladera 08gdeps5770j1zv",
    "jai ma sharda mansa pb 03cbjpg0613h2z8",
    " jai janki plywood bassi 08aaqfj2604k1z4",
    "jai ambey bassi 08aalfj6019r1zm",
    "jai shiv plywood hr 06aaacj7036n1zc",
    "jai bajrang jaipur 08aaccj4414a1z5",
    "jai durga punjab 03aaspm2451p2z8",
    "jagdamba interprises  bassi 08aamfj3607n1zx",
    "janki product bihar 10aaqfj0437q1z4",
    "janki plywood bassi 08aahfj9882c1z0",
    "kanha wood kaladera 08aakfk6703a2zl",
    "kamlesh kasganj up 09aawpa2500p1zf",
    "kaushika plywood jhajjar 06aaack4766g1zj",
    "kawaijyoti plywood bassi 08aadfk0092k1za",
    "kasliwal ind bassi 08aahck2739a1zr",
    "kejriwal plywood jhunjhnu 08aaaca6699j1z6",
    "kgn plywood bassi  08cbppa4254g1zo",
    "keshav plywood kaladera 08aaeck1361r1z3",
    "kuchal timber delhi 07aaafk4991q1zn",
    "kone polymer 08aayfp6571h1zf",
    "khadudham plywood bassi 08amgpk0406l1z5",
    "lakhdata plywood  08aaifl8436h1zz",
    "liberty plywood govindgarh 08aakfl7930n1zn",
    "laxmi interprises bassi raj 08aaehb9899n1zb",
    "lamboria wood kaladera 08abepa2632h1z5",
    "laxmi plywood kaladera 08aaacl6811f1zq",
    "manikarnika enterprises alwar ",
    "matrix cutting tools fbd 06aaicm1529k1zd",
    "marut timber delhi 07aaafm6908r1zq",
    "madhav plywood kaladera 08aggpa9157l1z2",
    "muzzafarpur timber bihar 10adqpj0842a1z9",
    "mercy wood uk 05abkfm3591m1zr",
    "mg industries faridababad 06csipm9351a1zs",
    "mb plywood rudrapur 05aabcm9381j1z6",
    "manikarnika,alwar,08auopk5179n2zo",
    "mysore marketing pb 03aaacm7908a1z1",
    "mrs plywood hr 06aakcm6505d1zo",
    "mak ply kashmeer 01aaxfm4342e1ze",
    "mayur engenirs ,faridabad 06aafcm1348b1zy",
    "modern panal sampla 06aaacm8336n1z4",
    "kapor plywood muzzafarnagar 09abbpk6260a1z2",
    "mudhar ply hr 06aadcm3545j1zg",
    "mayur enginer rdr 05aarfm6889j2zc",
    "navkar laminate indor 23arhpj4812d1za",
    "nk matel faridabad 06bywpa5551p1zq",
    "nm tripathi timber sonda up 09aenpt0695m1zj",
    "niyati plywood palsana raj 08aaIcn5478n1zm",
    "neeraj veeneer bihar 10bcjpk5797e1zk",
    "narinder kumar pb 03aaafn6557f1zh",
    "new dev jalalabad up 09fctps9240a1z3",
    "narain hardwear faridabad 06amupk7491h1zd",
    "north bihar agro bihar 10aarfn2760m1z1",
    "national infra baddi 02aaacn9547n1z4",
    "maisur marketing punjab 03aaacm7908a1z1",
    "om parkash bagga delhi 07aaafo0462a1zy",
    "organic india pvt ltd.faridabad 06aaac15675e1zn",
    "pancham plywood kaladera 08aabcp1181f1zo",
    "pardeep timber delhi 07aajfp4265h1z1",
    "pinki plywood bihar 10eyupk5162f1zc",
    "prime woodp hr 06aayfp3316n1zl",
    "perfect impex raj. 08aaufp2443a1za",
    "petrorise manufecture,alwar,08aayfp6571h1zf",
    "prem pacakaging mbd 09aaifp3895j1zj",
    "pashupati ind bassi 08aabfp2768f1z7",
    "pinkcity plywood bassi 08aajcs7615m1zr",
    "pm woodcraft kaladera 08aaacp7477m1zr",
    "rl ply pb 03aaifr4396n1zn",
    "rajdhani plywood mundka delhi 07ajepa9941p1zr",
    "rani sati bassi 08aaefr3245c1zi",
    "rama plywood pb 03aabcr6966n1zw",
    "ru plywood rohtak 06aaccr3518h1zk",
    "radhe radhe plywood pb 03aasfr3375h1zx",
    "rp wood ajmer 08aabcr7403c1zr",
    "raj plywood co.haridwar 05acqpm4815k1z9",
    "realply halalpur 06aaacu1538l1za",
    "radhika ind pb 03aaefr5298p1zk",
    "rajan plywood pb 03aaecr7322r1z1",
    "rama plywood pb 03aabcr6966n1zw",
    "runner export pb 03atqpa4812k3zr",
    "rks ply bassi 08bigps7088m1za",
    "rk ply ind pb 03avfpb3556q1zg",
    "rs impex pb 03kpkps4431a1z1",
    "ramneek international pb 03aaacr7583e1zh",
    "radha govind plywood bassi 08adupl9230a2zf",
    "radhe krishna ind 05abgfr7270q1zi",
    "radha ind bassi 08acipj7898m1zl",
    "saint malware 08aascs2804h1z4",
    "samrat plywood hp 02aaccs0259e1zx",
    "samrat plywood pb 03adefs0951r1zr",
    "sanwood ind karnal hr 06abhcs3321b1zv",
    "sachi interprises jalalabad up 09bgops8598g1z9",
    "sharma ply bihar 10cftps4531j1z6",
    "sanyam trading hapur 09aoapk3488e1zw",
    "sohal sons pb 03ayaps8420n1z7",
    "saluja sales delhi 07arzps1261m1zx",
    "sangmashwer ply pb 03acefs2218n1z5",
    "sanwaria plywood kaladera 08bjlpj8764p1z5",
    "sk traders rishikesh 05aacfs9107l1z1",
    "s.r. plywood 08bjipa0953j1za bassi",
    "s b wood kaladera 08adgfs4844k1zl",
    "sharda plywood kota raj 08aczpss570n1zg",
    "shanti plywood govindgarch 08aigpa8668l2zq",
    "shiv shakti kaladera 08adbfs5479f1zs",
    "shiv shakti ind kanota 08abzfs1738f1zm",
    "shiv wood craft bassi 08bhbps6456d1z7",
    "shanti swroop timber jaipur 08aeqfs0150m1zm",
    "shree balaje indoor 23agzpg3096k1zt",
    "shree badri narayan bassi 08aaihs4086e1zw",
    "shreeram plywood meerut 09abbfs4542b1zg",
    "shree krishna bareilly up 09atfpa0272l1zs",
    "shree je plywood bassi 08adhfs4231k1zv",
    "shree krishna pb 03aeifs0675k1zu",
    "shree gopal ply pb 03abjfs1773n1zs",
    "shree govind plywood kanota 08fkkps6793f1zb",
    "shree mahabir alahabad up 09adzpa0542m1z6",
    "shree manglam ply kaladera 08caupa8707n1z0",
    "shree krishna wood  kaladera 08acwfs4026q1z6",
    "shree sachidanand pb 03adffs2268c1zf",
    "shree shyam 2 kaladera 08adifs4957k2zc",
    "shivhari ply uk 05aaacs2083a1zz",
    "shree shyam kaladera 08achfs3428d1z7",
    "shree vaibhav luxmi kanota 08bigps7088m1za",
    "stonehil hapur 09abacs3355c1zk",
    "shree vinayak kaladera 08aafpy1442f2zn",
    "sun interio gzb 09aarcs9517j1zi",
    "sumer chand delhi 07acupk2635h1zc",
    "sun plywood kaladera 08acrpb9413b1zs",
    "sunder ply d.dune uk 05aerpk7995m1zf",
    "sunshine ind pb 03dinps1588f1zx",
    "sunrise ind kaladera 08admfs6180l1zc",
    "swastik interprises y nagar hr 06adsfs5525m1zd",
    "suraj wood kaladera 08aaefs1660e1ze",
    "trishul plywood pb 03aabct3184a1zx",
    "trishul teek pb 03aabct7751m1z3",
    "teja plywood doongargarh raj 08dbzpr6313e1z4",
    "tanishq enterprises bassi 08aamft5180e1zy",
    "tirupati plywood kaladera 08aalft9184h1zh",
    "urban ply meerut 09ekfps0053a1zg",
    "uma mangal decor gujrat 24bsnpp3510j1zn",
    "universal digital connect .hr. 06aabcu0780f1zk",
    "unique plywood sonepat 06aaacu1538l1za",
    "veena veniers motipur bihar 10ckvpk6530j1zy",
    "vohra badaun 09abnpv0436d1zj",
    "welcome door sampla 06aadfw0098b1zf",
    "woodbay exports hr 06aaafw7607d1zd",
    "wood crafts pb 03aadfw5468k1zu",
    "wood mack bassi 08actpa6658b1zi",
    "wood home,faridabad,06ayeps2584d1zd",
    "zaid plywood meerut 09angpg3390l1zo",
    "windsor wood delhi 07bfhps4524n1zx",
  ];
  const gstPaidBySuggestions = [
    "Consignor",
    "Consignee",
    "Transporter",
    "Exampted",
  ];

  useEffect(() => {
    // Remove bilty number suggestions after initial value is entered
    if (initialBiltyNumber !== "") {
      const updatedData = [...data];
      updatedData.forEach((row) => {
        delete row.serialNumber;
      });
      setData(updatedData);
    }
  }, [initialBiltyNumber]);

  const handleInputChange = (value, rowIndex, columnName) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnName] = value;
    setData(updatedData);
  };

  const addRow = () => {
    if (!data[data.length - 1].serialNumber) {
      alert(
        "Please fill the Bilty Number in the current row before adding a new row."
      );
      return;
    }

    const previousRowDate = data[data.length - 1].date;
    setData([
      ...data,
      {
        id: data.length + 1,
        serialNumber: (
          parseInt(data[data.length - 1].serialNumber) + 1
        ).toString(),
        date: previousRowDate,
        freight: "",
        consignor: "",
        consignee: "",
        gstPaidBy: "",
      },
    ]);
  };

  const saveAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "excel_sheet.xlsx");
  };

  return (
    <div className="overflow-x-auto">
      <button
        onClick={saveAsExcel}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded border border-green-700"
      >
        Save as Excel
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table header */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50px"
            >
              Bilty Number
            </th>
            <th
              scope="col"
              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Freight
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-widerw-25"
            >
              Consignor Name
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-25"
            >
              Consignee Name
            </th>
            <th
              scope="col"
              className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
            >
              GST Paid By
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {/* Bilty Number Input */}
              <td className=" whitespace-nowrap">
                <input
                  type="text"
                  value={row.serialNumber}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "serialNumber")
                  }
                  className="border border-gray-300 "
                />
              </td>
              {/* Date Input */}
              <td className=" whitespace-nowrap">
                <DatePicker
                  selected={row.date ? new Date(row.date) : null}
                  onChange={(date) =>
                    handleInputChange(
                      date ? date.toISOString().slice(0, 10) : "",
                      index,
                      "date"
                    )
                  }
                  className="border border-gray-300 "
                  dateFormat="yyyy-MM-dd"
                />
              </td>
              {/* Freight Input */}
              <td className=" whitespace-nowrap">
                <input
                  type="text"
                  value={row.freight}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "freight")
                  }
                  className="border border-gray-300 "
                />
              </td>
              {/* Consignor Name Input */}
              <td className=" whitespace-nowrap border">
                <input
                  type="text"
                  value={row.consignor}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "consignor")
                  }
                  className="border border-gray-300  "
                  list="consignorSuggestions"
                />
                <datalist id="consignorSuggestions">
                  {consignorSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
              {/* Consignee Name Input */}
              <td className=" whitespace-nowrap border">
                <input
                  type="text"
                  value={row.consignee}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "consignee")
                  }
                  className="border border-gray-300  "
                  list="consigneeSuggestions"
                />
                <datalist id="consigneeSuggestions">
                  {consigneeSuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
              {/* GST Paid By Input */}
              <td className="whitespace-nowrap border">
                <input
                  type="text"
                  value={row.gstPaidBy}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "gstPaidBy")
                  }
                  className="border border-gray-300  "
                  list="gstPaidBySuggestions"
                />
                <datalist id="gstPaidBySuggestions">
                  {gstPaidBySuggestions.map((suggestion, i) => (
                    <option key={i} value={suggestion} />
                  ))}
                </datalist>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Buttons */}
      <div className="">
        {/* Add Row Button */}
        <button
          onClick={addRow}
          className="mt-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border border-blue-700"
        >
          Add Row
        </button>
        {/* Save as Excel Button */}
      </div>
    </div>
  );
};

export default ExcelSheet;

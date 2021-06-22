var documenterSearchIndex = {"docs":
[{"location":"references/#References","page":"References","title":"References","text":"","category":"section"},{"location":"references/#Clock","page":"References","title":"Clock","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"RecordedArrays.AbstractClock\nDiscreteClock\nContinuousClock\nnow\nlimit\nstart\ninit!\nincrease!","category":"page"},{"location":"references/#RecordedArrays.AbstractClock","page":"References","title":"RecordedArrays.AbstractClock","text":"AbstractClock{T<:Real}\n\nSupertype of clocks with time of type T.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.DiscreteClock","page":"References","title":"RecordedArrays.DiscreteClock","text":"DiscreteClock([start], timelist)\nDiscreteClock(stop)\n\nClock for discrete-time process, time of which muse be increased with given step and can't be updated manually. The timelist must be a non-empty and monotonically increasing AbstractVector.  If the start is not specified, the first item of timelist will be deleted and set as start. During iteration, the current time will be updated automatically and returned as iteration item. When the iteration finished without break, init! will be applied.  DiscreteClock(stop) will create a clock with start=0 and timelist=Base.OneTo(stop)\n\nExamples\n\njulia> c = DiscreteClock(0:3);\n\njulia> now(c)\n0\n\njulia> [(t, now(c)) for t in c]\n3-element Vector{Tuple{Int64, Int64}}:\n (1, 1)\n (2, 2)\n (3, 3)\n\njulia> now(c)\n0\n\njulia> c = DiscreteClock(3); # similar to DiscreteClock(0:3)\n\njulia> (now(c), collect(c))\n(0, [1, 2, 3])\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.ContinuousClock","page":"References","title":"RecordedArrays.ContinuousClock","text":"ContinuousClock{T, I<:Union{Nothing, DiscreteClock}} <: AbstractClock{T}\nContinuousClock(stop, [start=zero(stop)]; [max_epoch=nothing])\n\nA clock for continuous-time process. Unlike the DiscreteClock, during iteration, the current time will not be update automatically, but update by increase! manually. Besides the epoch of current iteration instead of current time will be returned. If the max_epoch is specified, the iteration will break when epoch reach to the max_epoch, even now(c) < limit(c), and break in this way the init!(c) will not be applied.\n\nExamples\n\njulia> c = ContinuousClock(3.0; max_epoch=2);\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n1.0\t1\n2.0\t2\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n3.0\t1\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n1.0\t1\n2.0\t2\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.now","page":"References","title":"RecordedArrays.now","text":"now(c::AbstractClock)\n\nReturn current time of clock c.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.limit","page":"References","title":"RecordedArrays.limit","text":"limit(c::AbstractClock)\n\nReturn the limit of clock c. For a ContinuousClock c, the max time might larger than limit(c).\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.start","page":"References","title":"RecordedArrays.start","text":"start(c::AbstractClock)\n\nReturn the start time of clock c.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.init!","page":"References","title":"RecordedArrays.init!","text":"init!(c::AbstractClock)\n\nUpdate current time to start time.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.increase!","page":"References","title":"RecordedArrays.increase!","text":"increase!(c::ContinuousClock, t::Real)\n\nUpdate current time of clock c to now(c) + t.\n\n\n\n\n\n","category":"function"},{"location":"references/#Recorded-Arrays","page":"References","title":"Recorded Arrays","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"RecordedArrays.AbstractRArray\nRecordedArrays.StaticRArray\nRecordedArrays.DynamicRArray\nstate\nsetclock","category":"page"},{"location":"references/#RecordedArrays.AbstractRArray","page":"References","title":"RecordedArrays.AbstractRArray","text":"AbstractRArray{V,T,N} <: AbstractArray{V,N}\n\nSupertype of recorded N-dimensional arrays with elements of type V and time of type T\", whose changes will be recorded automatically. AbstractRArray is a subtype of AbstractArray, so array operations like getindex, setindex!, length, size, mathematical operations like +, -, *, / and broadcast on a recorded array A works same as its current state state(A).\n\nnote: Note\nAvoid to edit recorded arrays out of loop, because clocks will initial automatically during loop.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.StaticRArray","page":"References","title":"RecordedArrays.StaticRArray","text":"StaticRArray{V,T,N} <: AbstractRecord{V,T,N}\n\nRecord type to record changes of arrays whose elements never change but insert or delete can  be created by StaticRArray(t::AbstractClock, xs...) where xs are abstract arrays to be recorded.\n\nImplemented statical arrays:\n\nStaticRVector\n\nnote: Note\nElements of StaticRArray A can be delete by deleteat!(A,i), whose value after deletion is 0.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> v = StaticRArray(c, [0, 1, 2])\nrecorded 3-element Vector{Int64}:\n 0\n 1\n 2\n\njulia> for epoch in c\n           push!(v, epoch+2) # push a element\n           deleteat!(v, 1)   # delete a element\n       end\n\njulia> v # there are still three element now\nrecorded 3-element Vector{Int64}:\n 3\n 4\n 5\n\njulia> record(v)[6] # but six element are recorded\nRecord Entry\nt: 2-element Vector{Int64}:\n 3\n 3\nv: 2-element Vector{Int64}:\n 5\n 5\n\njulia> gettime(record(v)[1], 2)[1] # element after deletion is 0\n0\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.DynamicRArray","page":"References","title":"RecordedArrays.DynamicRArray","text":"DynamicRArray{V,T,N} <: AbstractRecord{V,T,N}\n\nRecorded array whose elements change overtime can be created by DynamicRArray(t::AbstractClock, xs...) where xs are abstract arrays or numbers (or called scalar) to be recorded.\n\nImplemented dynamic arrays:\n\nDynamicRScalar\nDynamicRVector\n\nnote: Note\nFor a recorded dynamical scalar S, use S[1] = v to change its value instead of S = v.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> s, v = DynamicRArray(c, 0, [0, 1]);\n\njulia> s # scalar\nrecorded 0\n\njulia> v # vector\nrecorded 2-element Vector{Int64}:\n 0\n 1\n\njulia> for epoch in c\n           s[1] += 1\n           v[1] += 1\n       end\n\njulia> s\nrecorded 3\n\njulia> v\nrecorded 2-element Vector{Int64}:\n 3\n 1\n\njulia> record(s)[1]\nRecord Entry\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\n\njulia> record(v)[1]\nRecord Entry\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\n\njulia> record(v)[2]\nRecord Entry\nt: 1-element Vector{Int64}:\n 0\nv: 1-element Vector{Int64}:\n 1\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.state","page":"References","title":"RecordedArrays.state","text":"state(A::AbstractRArray{V,T,N}) -> Array{V,N}\n\nGet current state of recorded array A. API for mathematical operations.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.setclock","page":"References","title":"RecordedArrays.setclock","text":"setclock(A::AbstractRArray, c::AbstractClock)\n\nNon-mutating setclock for A. It will create a deepcopy of A besides  the clock field, which will be assigned to c.\n\n\n\n\n\n","category":"function"},{"location":"references/#View-Record","page":"References","title":"View Record","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"RecordedArrays.Record\nrecord\nRecordedArrays.AbstractEntry\nRecordedArrays.SingleEntry\nRecordedArrays.UnionEntry\ngettime\nunione\ngetts\ngetvs\ntoseries\ntspan\nselectrecs","category":"page"},{"location":"references/#RecordedArrays.Record","page":"References","title":"RecordedArrays.Record","text":"Record{T<:AbstractRArray}\n\nContain a RecordedArray, whose elements are record of each element of given array.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.record","page":"References","title":"RecordedArrays.record","text":"record(A::AbstractRArray) -> Record\n\nCreate a Record with RecordedArray A.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.AbstractEntry","page":"References","title":"RecordedArrays.AbstractEntry","text":"AbstractEntry{V,T<:Real}\n\nSupertype of entry, which store changes of specified variable(s) of type V with time of type T.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.SingleEntry","page":"References","title":"RecordedArrays.SingleEntry","text":"SingleEntry{V,T} <: AbstractEntry{V,T}\n\nType to store changes of a specified variable of type V with time of type T, element of Record.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.UnionEntry","page":"References","title":"RecordedArrays.UnionEntry","text":"UnionEntry{V,T,N} <: AbstractEntry{T,V}\n\nType store changes of N variables of type V with time of type T, created by unione.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.gettime","page":"References","title":"RecordedArrays.gettime","text":"gettime(e::AbstractEntry{V}, t::Real) -> V\ngettime(e::AbstractEntry{V}, ts) -> Vector{V}\n\nGet the value(s) of e at time t, If t is not in ts(e), return value at time ts(e)[i] where ts(e)[i] < t < ts(e)[i+1]. If a iterator of time ts is given, return the value of each time in ts.\n\nnote: Note\nts must be monotonically increasing.\n\nExamples\n\njulia> c = DiscreteClock(5);\n\njulia> d = DynamicRArray(c, 0);\n\njulia> s = StaticRArray(c, [0]);\n\njulia> for t in c\n           d[1] += 1\n           push!(s, t)\n           t >= 3 && deleteat!(s, 1)\n       end\n\njulia> ed = record(d)[1]\nRecord Entry\nt: 6-element Vector{Int64}:\n 0\n 1\n 2\n 3\n 4\n 5\nv: 6-element Vector{Int64}:\n 0\n 1\n 2\n 3\n 4\n 5\n\njulia> es = record(s)[2]\nRecord Entry\nt: 2-element Vector{Int64}:\n 1\n 4\nv: 2-element Vector{Int64}:\n 1\n 1\n\njulia> gettime(ed, 1.5)\n1\n\njulia> gettime(ed, [5, 6])\n2-element Vector{Int64}:\n 5\n 5\n\njulia> gettime(es, [2, 5])\n2-element Vector{Int64}:\n 1\n 0\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.unione","page":"References","title":"RecordedArrays.unione","text":"unione(es::AbstractEntry...)\nunione(es::Vector{<:AbstractEntry})\nunione(r::Record)\n\nConstruct the union of given entry es. union(r) construct union all of elements of Record r.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> v = DynamicRArray(c, [1, 1, 1]);\n\njulia> for t in c\n           v[t] = 2\n       end\n\njulia> ea, eb, ec = record(v);\n\njulia> ue = unione(ea, eb)\nRecord Entry\nt: 3-element Vector{Int64}:\n 0\n 1\n 2\nv: 3×2 Matrix{Int64}:\n 1  1\n 2  1\n 2  2\n\njulia> ue = unione(ue, ec)\nRecord Entry\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4×3 Matrix{Int64}:\n 1  1  1\n 2  1  1\n 2  2  1\n 2  2  2\n\njulia> unione(record(v))\nRecord Entry\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4×3 Matrix{Int64}:\n 1  1  1\n 2  1  1\n 2  2  1\n 2  2  2\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.getts","page":"References","title":"RecordedArrays.getts","text":"getts(e::AbstractEntry{V,T}) -> Vector{T}\n\nGet time entry of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.getvs","page":"References","title":"RecordedArrays.getvs","text":"getvs(e::AbstractEntry{V,T}) -> VecOrMat{V}\n\nGet value entry of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.toseries","page":"References","title":"RecordedArrays.toseries","text":"toseries(e::AbstractEntry)\n\nConvert e to the form accepted by plot of Plots.jl.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.tspan","page":"References","title":"RecordedArrays.tspan","text":"tspan(e::AbstractEntry{V,T}) -> T\n\nGet last time of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.selectrecs","page":"References","title":"RecordedArrays.selectrecs","text":"selectrecs(r::Union{Record,AbstractEntry}, [vars])\n\nSelect and process values in r. vars can be a Tuple ([f], [ts], [T0], [inds...]) and return a tuple of values:\n\nf is a function for process data at each time which should accpect n parameters where n is the number of index and return a tuple. If f is not given, data will not be processed.\nts should be an iterator of real number, this function will get values at each t in ts.  If ts is not given, ts will be a vector contains each time given value changed.\nT0 is a constant, if T0 is given, this function will return ts as first element of returned tuple.\ninds are indices, like (i1, i2, ..., in), only the values at given indices will be selected and processed. If inds is not given, all values will be selected and processed.\n\nvars can also be unpacked, like selectrecs(r, f, ts, T0, inds...).\n\nExample\n\njulia> c = DiscreteClock(10); # create a clock\n\njulia> pos = DynamicRArray(c, [0, 0]); # create a rarray\n\njulia> for t in c # do some changes\n           if  t % 2 == 0\n               pos[1] += 1\n           else\n               pos[2] -= 1\n           end\n       end\n\njulia> r = record(pos); # create a record\n\njulia> selectrecs(r) # select without vars will return all value\n([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5], [0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5])\n\njulia> selectrecs(r, (T0, 1, 2)) # select with T0 and indices\n([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5], [0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5])\n\njulia> selectrecs(r, (0:2:10, T0, 1, 2)) # select with ts and indices\n(0:2:10, [0, 1, 2, 3, 4, 5], [0, -1, -2, -3, -4, -5])\n\njulia> f(t, x, y) = t, x + y; # define a process function\n\njulia> selectrecs(r, (f, T0, 1, 2)) # select with a function and indices\n([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0])\n\n\n\n\n\n","category":"function"},{"location":"manual/#Manual","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"manual/#Define-a-Clock","page":"Manual","title":"Define a Clock","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"To record changes of array automatically, the array must refer to a time variable called Clock, and you must use a Clock storing your time variable.  There are different types of Clocks: ContinuousClock for continuous-time process and DiscreteClock for discrete.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Once you have defined a Clock, like:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"c = ContinuousClock(10.0);","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"which create a ContinuousClock start at t=0 and end at t=10. Your can get the current time by now, and update the current time by increase! (you can't updated a DiscreteClock by increase!).","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Clocks also provide the iterator interfaces:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"for epoch in c\n    # do something which don't change state\n    increase!(c, 1)\n    # do something which change state\nend","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"which is equivalent to","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"t = 0.0\nepoch = 0\nwhile t <= 10.0\n    epoch += 1\n    # do something\n    t += 1\n    # do something\nend","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Iterate a Clock by a for loop is recommended, and every operation on Clock and RArray should be avoided. Besides, iteration is the only way to update the current time of DiscreteClock. During the loop, some state of Clock were updated automatically and if iteration finished when reach to end, Clock will be initialized by init! automatically.","category":"page"},{"location":"manual/#Create-and-Mutate-RecordedArrays","page":"Manual","title":"Create and Mutate RecordedArrays","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"TODO","category":"page"},{"location":"manual/#Get-and-Processing-records","page":"Manual","title":"Get and Processing records","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"TODO","category":"page"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"During running a simulation, one of the most important but annoying part is recording and processing the changing values of state. This package provides RecordedArray types. Convert arrays to RecordedArrays, then all changes will be recorded automatically. Besides, this package provide some tools to access and process recorded data.","category":"page"},{"location":"#Installation","page":"Introduction","title":"Installation","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"This is a registered package, so it can be installed with the add command in the Pkg REPL:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"pkg> add RecordedArrays","category":"page"},{"location":"#Quick-Start","page":"Introduction","title":"Quick Start","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using RecordedArrays # load this package\n\njulia> c = ContinuousClock(3.0); # define a clock\n\njulia> v = DynamicRArray(c, [0, 1]) # create a recorded array with the clock\nrecorded 2-element Vector{Int64}:\n 0\n 1\n\njulia> v + v # math operations work as normal array\n2-element Vector{Int64}:\n 0\n 2\n\njulia> v .* v # broadcast works as normal array as well\n2-element Vector{Int64}:\n 0\n 1\n\njulia> increase!(c, 1) # when time goes and array changes, increase the define clock firstly\n1.0\n\njulia> v[1] += 1 # change array's element\n1\n\njulia> push!(v, 1) # push a new element\nrecorded 3-element Vector{Int64}:\n 1\n 1\n 1\n\njulia> r = record(v) # view recorded changes by creating a record\nrecord for 3-element dynamic Vector{Int64} with time Float64\n\njulia> r[1] # show entries of the first element of v, which changed to 1 at `t=1.0`\nRecord Entry\nt: 2-element Vector{Float64}:\n 0.0\n 1.0\nv: 2-element Vector{Int64}:\n 0\n 1\n\njulia> r[3] # show entries of the third element of v, which was pushed at `t=1.0`\nRecord Entry\nt: 1-element Vector{Float64}:\n 1.0\nv: 1-element Vector{Int64}:\n 1\n\njulia> # if you want to calculate the sum of v at each timestamp\n\njulia> f(t, x...) = t, sum(x); # defined a function calculate the sum firstly\n\njulia> selectrecs(r, f, T0) # apply f by selectrecs will return sum of v at each timestamp\n([0.0, 1.0], [1, 3])","category":"page"},{"location":"example/#Example","page":"Example","title":"Example","text":"","category":"section"},{"location":"example/#Gaussian-random-walk","page":"Example","title":"Gaussian random walk","text":"","category":"section"},{"location":"example/","page":"Example","title":"Example","text":"This is a simple implementation to simulate a 2-D Gaussian random walk.","category":"page"},{"location":"example/","page":"Example","title":"Example","text":"using RecordedArrays\nusing Plots\nusing Random\n\nRandom.seed!(1)\n\nc = DiscreteClock(10000) # define a clock, the particle will walk 10000 epoch\npos = DynamicRArray(c, [0.0, 0.0]) # create a pos vector of the particle\n\nfor t in c\n    pos .+= randn(2) # walk randomly at each epoch\nend\n\n# plot path of particle\nplot(record(pos); frame=:none, grid=false, legend=false)","category":"page"},{"location":"example/#Logistic-growth","page":"Example","title":"Logistic growth","text":"","category":"section"},{"location":"example/","page":"Example","title":"Example","text":"This is a simple implementation of Gillespie algorithm with direct method to simulate a Logistic growth population with growth rate r=05 and carrying capacity K=100.","category":"page"},{"location":"example/","page":"Example","title":"Example","text":"using RecordedArrays\nusing Plots\nusing Random\n\nRandom.seed!(1)\n\nc = ContinuousClock(100.0) # define a clock, the population will growth for 100 time unit\nn = DynamicRArray(c, 10)   # define a scalar to record population size\n\nconst r = 0.5\nconst K = 100\n\nfor _ in c\n    # eval a_i\n    grow = r * n         # intrinsic growth\n    comp = r * n * n / K # resource competition\n\n    sumed = grow + comp  # sum a_i\n\n    τ = -log(rand()) / sumed # compute time intervel\n\n    increase!(c, τ) # update current time\n\n    # sample a reation and adjust population size\n    if rand() * sumed < grow\n        n[1] += 1\n    else\n        n[1] -= 1\n    end\n\n    state(n) <= 0 && break # break if population extinct\nend\n\nplot(record(n)...; frame=:box, grid=false, legend=false) # plot population dynamics","category":"page"}]
}
